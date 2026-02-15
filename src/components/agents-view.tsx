"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronDown, X } from "lucide-react";
import type { Agent } from "@/lib/types";

export function AgentsView() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentDetails, setAgentDetails] = useState<any>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then(r => r.json())
      .then(data => setAgents(data.agents || []));
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      fetch(`/api/agents/${selectedAgent}`)
        .then(r => r.json())
        .then(setAgentDetails);
    } else {
      setAgentDetails(null);
    }
  }, [selectedAgent]);

  const levelColors = {
    L1: "bg-blue-500/20 text-blue-500",
    L2: "bg-green-500/20 text-green-500",
    L3: "bg-yellow-500/20 text-yellow-500",
    L4: "bg-red-500/20 text-red-500",
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedAgent(agent.id)}
            className="glass-card rounded-2xl p-5 cursor-pointer hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${levelColors[agent.level]}`}>
                {agent.level}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                agent.status === "active" ? "bg-success/20 text-success" : "bg-muted/20 text-muted-foreground"
              }`}>
                {agent.status}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">Model: {agent.model}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Agent Detail Panel */}
      <AnimatePresence>
        {selectedAgent && agentDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Agent Details: {selectedAgent}</h2>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {agentDetails.soul && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Personality (SOUL)</h3>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{agentDetails.soul}</pre>
                </div>
              </div>
            )}

            {agentDetails.rules && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Capabilities & Rules</h3>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{agentDetails.rules}</pre>
                </div>
              </div>
            )}

            {agentDetails.outputs && agentDetails.outputs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Recent Outputs</h3>
                <div className="space-y-2">
                  {agentDetails.outputs.slice(0, 5).map((output: string, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-xs text-muted-foreground">{output}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
