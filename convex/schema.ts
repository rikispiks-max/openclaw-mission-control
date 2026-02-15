import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(), // "info" | "warning" | "error" | "success"
    timestamp: v.string(),
  }),

  calendarEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.string(),
    endTime: v.string(),
    type: v.string(), // "meeting" | "deadline" | "reminder"
  }),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(), // "pending" | "in_progress" | "completed"
    priority: v.string(), // "high" | "medium" | "low"
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  }),

  contacts: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    notes: v.optional(v.string()),
  }),

  contentDrafts: defineTable({
    title: v.string(),
    platform: v.string(), // "twitter" | "linkedin" | "blog"
    content: v.string(),
    status: v.string(), // "draft" | "review" | "approved" | "published"
    createdAt: v.string(),
    publishedAt: v.optional(v.string()),
  }),

  ecosystemProducts: defineTable({
    name: v.string(),
    slug: v.string(),
    status: v.string(), // "active" | "development" | "concept"
    health: v.string(), // "healthy" | "warning" | "error"
    metrics: v.optional(v.any()),
  }),
});
