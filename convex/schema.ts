import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    deviceId: v.string(),
    totalExp: v.number(),
    level: v.number(),
  }).index("by_device", ["deviceId"]),

  tasks: defineTable({
    deviceId: v.string(),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    category: v.string(),
    status: v.union(v.literal('pending'), v.literal('running'), v.literal('done'), v.literal('cancelled')),
    hasReminder: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_device", ["deviceId"])
    .index("by_device_date", ["deviceId", "date"]),

  activityLogs: defineTable({
    deviceId: v.string(),
    timestamp: v.number(),
    actionType: v.union(v.literal('create'), v.literal('edit'), v.literal('delete'), v.literal('status')),
    taskTitle: v.string(),
    description: v.string(),
    expGained: v.optional(v.number()),
  })
    .index("by_device", ["deviceId"])
    .index("by_device_time", ["deviceId", "timestamp"]),
});
