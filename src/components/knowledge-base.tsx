"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Database } from "lucide-react";

export function KnowledgeBase() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Search Knowledge Base</h2>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across all workspace files..."
          className="w-full px-4 py-3 rounded-xl glass-card border-0 focus:ring-2 focus:ring-primary"
        />
      </div>

      {!query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Enter a query to search the knowledge base</p>
        </motion.div>
      )}
    </div>
  );
}
