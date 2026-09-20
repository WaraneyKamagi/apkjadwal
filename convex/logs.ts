import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Dapatkan log aktivitas berdasarkan Device ID (Rentang Waktu Terbatas)
export const getByDevice = query({
  args: { 
    deviceId: v.string(),
    startTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityLogs")
      .withIndex("by_device_time", (q) => 
        q.eq("deviceId", args.deviceId)
         .gte("timestamp", args.startTimestamp)
      )
      .order("desc") // yang terbaru di atas
      .collect();
  },
});

// 2. Tambahkan log aktivitas baru
export const add = mutation({
  args: {
    deviceId: v.string(),
    actionType: v.union(v.literal('create'), v.literal('edit'), v.literal('delete'), v.literal('status')),
    taskTitle: v.string(),
    description: v.string(),
    expGained: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("activityLogs", {
      ...args,
      timestamp: Date.now(),
    });
    return logId;
  },
});
