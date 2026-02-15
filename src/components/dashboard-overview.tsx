"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Bot, Clock, DollarSign, FileText, Activity } from "lucide-react";
import { ActivityFeed } from "./activity-feed";

export function DashboardOverview() {
  const [systemState, setSystemState] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [crons, setCrons] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any>(null);

  useEffect(() => {
    // Fetch all data
    const fetchData = async () => {
      const [sys, agts, crn, rev, pipe] = await Promise.all([
        fetch("/api/system-state").then(r => r.json()),
        fetch("/api/agents").then(r => r.json()),
        fetch("/api/cron-health").then(r => r.json()),
        fetch("/api/revenue").then(r => r.json()),
        fetch("/api/content-pipeline").then(r => r.json()),
      ]);

      setSystemState(sys);
      setAgents(agts);
      setCrons(crn);
      setRevenue(rev);
      setPipeline(pipe);
    };

    fetchData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mission Control</h1>
          <p className="text-sm text-muted-foreground mt-1">System health & live monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">AUTO 15S</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* System Health */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">System Health</h3>
              <p className="text-xs text-muted-foreground">Services status</p>
            </div>
          </div>

          {!systemState ? (
            <div className="skeleton h-24 rounded-lg" />
          ) : (
            <div className="space-y-2">
              {systemState.servers?.slice(0, 3).map((server: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${server.status === "up" ? "bg-success" : "bg-destructive"}`} />
                    <span className="text-sm font-medium">{server.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">:{server.port}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Agent Status */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Agent Status</h3>
              <p className="text-xs text-muted-foreground">Active agents</p>
            </div>
          </div>

          {!agents ? (
            <div className="skeleton h-24 rounded-lg" />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{agents.count}</span>
                <span className="text-xs text-muted-foreground">total agents</span>
              </div>
              <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(agents.agents?.filter((a: any) => a.status === "active").length / agents.count) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {agents.agents?.filter((a: any) => a.status === "active").length} active, {agents.agents?.filter((a: any) => a.status !== "active").length} idle
              </p>
            </div>
          )}
        </motion.div>

        {/* Cron Health */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Cron Health</h3>
              <p className="text-xs text-muted-foreground">Scheduled jobs</p>
            </div>
          </div>

          {!crons ? (
            <div className="skeleton h-24 rounded-lg" />
          ) : (
            <div className="space-y-2">
              {crons.crons?.slice(0, 3).map((cron: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cron.status === "success" ? "bg-success" : "bg-destructive"}`} />
                    <span className="text-sm font-medium truncate">{cron.name}</span>
                  </div>
                  {cron.consecutiveErrors > 0 && (
                    <span className="text-xs text-destructive">{cron.consecutiveErrors}❌</span>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-white/[0.06] mt-3">
                <p className="text-xs text-muted-foreground">{crons.healthy}/{crons.total} healthy</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Revenue Tracker */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-xs text-muted-foreground">Financial snapshot</p>
            </div>
          </div>

          {!revenue ? (
            <div className="skeleton h-24 rounded-lg" />
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Current Revenue</p>
                <p className="text-2xl font-bold text-primary">${revenue.current?.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Burn</p>
                  <p className="text-sm font-medium text-destructive">${revenue.monthly_burn?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net</p>
                  <p className={`text-sm font-medium ${revenue.net >= 0 ? "text-success" : "text-destructive"}`}>
                    ${revenue.net?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Pipeline */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Content Pipeline</h3>
              <p className="text-xs text-muted-foreground">Publishing workflow</p>
            </div>
          </div>

          {!pipeline ? (
            <div className="skeleton h-24 rounded-lg" />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                <p className="text-2xl font-bold">{pipeline.drafts?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Draft</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                <p className="text-2xl font-bold">{pipeline.reviews?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Review</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                <p className="text-2xl font-bold">{pipeline.approved?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                <p className="text-2xl font-bold">{pipeline.published?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-xs text-muted-foreground">Latest events</p>
            </div>
          </div>

          <ActivityFeed limit={5} />
        </motion.div>
      </motion.div>
    </div>
  );
}
