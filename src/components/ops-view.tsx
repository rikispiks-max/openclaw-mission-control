"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, GitBranch, Eye, Target } from "lucide-react";

export function OpsView() {
  const [systemState, setSystemState] = useState<any>(null);
  const [observations, setObservations] = useState<string>("");
  const [priorities, setPriorities] = useState<string>("");

  useEffect(() => {
    Promise.all([
      fetch("/api/system-state").then(r => r.json()),
      fetch("/api/observations").then(r => r.json()),
      fetch("/api/priorities").then(r => r.json()),
    ]).then(([sys, obs, prio]) => {
      setSystemState(sys);
      setObservations(obs.observations || "");
      setPriorities(prio.priorities || "");
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Server Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Server Health</h2>
        </div>

        {!systemState ? (
          <div className="skeleton h-32 rounded-lg" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {systemState.servers?.map((server: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{server.name}</span>
                  <div className={`w-2 h-2 rounded-full ${server.status === "up" ? "bg-success" : "bg-destructive"}`} />
                </div>
                <p className="text-xs text-muted-foreground">Port: {server.port}</p>
                {server.lastCheck && (
                  <p className="text-2xs text-muted-foreground mt-1">Last: {new Date(server.lastCheck).toLocaleTimeString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Branch Status */}
      {systemState?.branchStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Branch Status</h2>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(systemState.branchStatus, null, 2)}</pre>
          </div>
        </motion.div>
      )}

      {/* Observations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Observations</h2>
        </div>

        {observations ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{observations}</pre>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No observations recorded</p>
        )}
      </motion.div>

      {/* Priorities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">System Priorities</h2>
        </div>

        {priorities ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{priorities}</pre>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No priorities set</p>
        )}
      </motion.div>
    </div>
  );
}
