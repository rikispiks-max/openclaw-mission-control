"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Code, AlertCircle } from "lucide-react";

export function CodePipeline() {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/repos")
      .then(r => r.json())
      .then(data => setRepos(data.repos || []));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo, index) => (
        <motion.div
          key={repo.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{repo.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <GitBranch className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{repo.branch}</p>
                </div>
              </div>
            </div>
            {repo.dirty > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20">
                <AlertCircle className="w-3 h-3 text-warning" />
                <span className="text-2xs text-warning">{repo.dirty}</span>
              </div>
            )}
          </div>

          {repo.lastCommit && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-muted-foreground font-mono">{repo.lastCommit}</p>
            </div>
          )}
        </motion.div>
      ))}

      {repos.length === 0 && (
        <div className="col-span-full glass-card rounded-2xl p-12 text-center">
          <Code className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No repositories found</p>
        </div>
      )}
    </div>
  );
}
