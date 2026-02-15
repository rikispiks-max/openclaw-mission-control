import { mutation } from "./_generated/server";

export const seedAll = mutation({
  handler: async (ctx) => {
    // Clear existing data
    const activities = await ctx.db.query("activities").collect();
    for (const activity of activities) {
      await ctx.db.delete(activity._id);
    }

    // Seed activities
    await ctx.db.insert("activities", {
      title: "System Started",
      description: "OpenClaw mission control initialized",
      type: "success",
      timestamp: new Date().toISOString(),
    });

    await ctx.db.insert("activities", {
      title: "Agent Deployed",
      description: "Primary agent deployed and active",
      type: "info",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    });

    // Seed calendar events
    await ctx.db.insert("calendarEvents", {
      title: "Weekly Review",
      description: "Review system performance and priorities",
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      type: "meeting",
    });

    // Seed tasks
    await ctx.db.insert("tasks", {
      title: "Review agent outputs",
      description: "Check recent agent outputs for quality",
      status: "pending",
      priority: "high",
    });

    await ctx.db.insert("tasks", {
      title: "Update documentation",
      description: "Update system documentation",
      status: "in_progress",
      priority: "medium",
    });

    // Seed content drafts
    await ctx.db.insert("contentDrafts", {
      title: "Building AI Agents",
      platform: "twitter",
      content: "Just deployed my autonomous AI agent system. It runs 24/7, manages tasks, and learns from interactions. The future is here 🚀",
      status: "draft",
      createdAt: new Date().toISOString(),
    });

    await ctx.db.insert("contentDrafts", {
      title: "AI Agent Architecture",
      platform: "blog",
      content: "# How I Built an Autonomous AI Agent System\n\nThis post covers the architecture, challenges, and lessons learned...",
      status: "review",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    });

    // Seed ecosystem products
    await ctx.db.insert("ecosystemProducts", {
      name: "OpenClaw",
      slug: "openclaw",
      status: "active",
      health: "healthy",
      metrics: {
        uptime: "99.9%",
        users: "150",
        revenue: "$5k MRR",
      },
    });

    await ctx.db.insert("ecosystemProducts", {
      name: "Mission Control",
      slug: "mission-control",
      status: "active",
      health: "healthy",
      metrics: {
        version: "1.0.0",
        deploys: "12",
      },
    });

    return { success: true };
  },
});
