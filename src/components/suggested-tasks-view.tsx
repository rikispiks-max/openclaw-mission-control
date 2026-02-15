"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Filter } from "lucide-react";
import type { Task } from "@/lib/types";

const categoryEmojis: Record<string, string> = {
  Revenue: "💰",
  Product: "🚀",
  Community: "👥",
  Content: "✍️",
  Operations: "⚙️",
  Clients: "🤝",
  Trading: "📈",
  Brand: "🎨",
};

export function SuggestedTasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/suggested-tasks")
      .then(r => r.json())
      .then(data => setTasks(data.tasks || []));
  }, []);

  const handleAction = async (taskId: string, action: "approved" | "rejected") => {
    await fetch("/api/suggested-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, action }),
    });

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: action } : t));
  };

  const filtered = tasks.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg glass-card text-sm border-0 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-lg glass-card text-sm border-0 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tasks Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{categoryEmojis[task.category] || "📋"}</span>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">{task.category}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                  task.priority === "high" ? "bg-destructive/20 text-destructive" :
                  task.priority === "medium" ? "bg-warning/20 text-warning" :
                  "bg-muted/20 text-muted-foreground"
                }`}>
                  {task.priority}
                </span>
                <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-primary/20 text-primary">
                  {task.effort}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-sm">{task.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{task.reasoning}</p>
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <p className="text-xs font-medium mb-1">Next Action:</p>
                <p className="text-xs text-muted-foreground">{task.nextAction}</p>
              </div>
            </div>

            {task.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(task.id, "approved")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-success/20 hover:bg-success/30 text-success font-medium text-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(task.id, "rejected")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive font-medium text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}

            {task.status !== "pending" && (
              <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${
                task.status === "approved" ? "bg-success/20 text-success" : "bg-muted/20 text-muted-foreground"
              }`}>
                {task.status === "approved" ? "✓ Approved" : "✗ Rejected"}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No tasks match your filters</p>
        </div>
      )}
    </div>
  );
}
