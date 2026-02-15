import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("ecosystemProducts").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    status: v.string(),
    health: v.string(),
    metrics: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ecosystemProducts", args);
  },
});
