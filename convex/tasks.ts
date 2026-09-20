import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Dapatkan semua tugas berdasarkan Device ID dan Rentang Tanggal
export const getByDevice = query({
  args: { 
    deviceId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId)
         .gte("date", args.startDate)
         .lte("date", args.endDate)
      )
      .order("desc")
      .collect();
  },
});

// 2. Tambahkan tugas baru
export const add = mutation({
  args: {
    deviceId: v.string(),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    category: v.string(),
    status: v.union(v.literal('pending'), v.literal('running'), v.literal('done'), v.literal('cancelled')),
    hasReminder: v.boolean(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
    });
    return taskId;
  },
});

// 3. Perbarui seluruh field tugas (Edit)
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    category: v.string(),
    hasReminder: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// 4. Perbarui hanya status tugas
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal('pending'), v.literal('running'), v.literal('done'), v.literal('cancelled')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// 5. Hapus tugas
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
