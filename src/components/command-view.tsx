"use client";

import { motion } from "framer-motion";
import { Terminal, RefreshCw, Power, GitBranch } from "lucide-react";

const commands = [
  { name: "Restart All Services", icon: RefreshCw, color: "text-blue-500" },
  { name: "Deploy Latest", icon: GitBranch, color: "text-green-500" },
  { name: "Clear Cache", icon: Terminal, color: "text-yellow-500" },
  { name: "Emergency Stop", icon: Power, color: "text-red-500" },
];

export function CommandView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {commands.map((cmd, index) => {
        const Icon = cmd.icon;
        return (
          <motion.button
            key={cmd.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl p-6 text-left hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                <Icon className={`w-5 h-5 ${cmd.color}`} />
              </div>
              <h3 className="font-semibold">{cmd.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">Click to execute</p>
          </motion.button>
        );
      })}
    </div>
  );
}
