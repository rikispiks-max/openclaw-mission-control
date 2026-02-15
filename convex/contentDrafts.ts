import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("contentDrafts").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    platform: v.string(),
    content: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentDrafts", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});
