"use client";

import { motion } from "framer-motion";
import { Cpu, DollarSign, Zap } from "lucide-react";

const models = [
  { name: "GPT-4o", provider: "OpenAI", use: "Primary reasoning", cost: "$5/1M tokens", fallback: "GPT-4-turbo" },
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", use: "Code generation", cost: "$3/1M tokens", fallback: "Claude 3 Opus" },
  { name: "GPT-4-turbo", provider: "OpenAI", use: "Fallback", cost: "$10/1M tokens", fallback: "GPT-3.5" },
  { name: "o1-mini", provider: "OpenAI", use: "Fast tasks", cost: "$1/1M tokens", fallback: "GPT-4o-mini" },
];

export function ModelsView() {
  return (
    <div className="space-y-4">
      {models.map((model, index) => (
        <motion.div
          key={model.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{model.name}</h3>
                <p className="text-xs text-muted-foreground">{model.provider}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium">Use Case</span>
              </div>
              <p className="text-xs text-muted-foreground">{model.use}</p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium">Cost</span>
              </div>
              <p className="text-xs text-muted-foreground">{model.cost}</p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium">Fallback</span>
              </div>
              <p className="text-xs text-muted-foreground">{model.fallback}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
