import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .first();
      
    // Jika user belum pernah ada, kembalikan default Level 1
    if (!user) {
      return { deviceId: args.deviceId, totalExp: 0, level: 1 };
    }
    
    return user;
  },
});

export const addExp = mutation({
  args: { 
    deviceId: v.string(), 
    expAmount: v.number() 
  },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (!user) {
      // Create user if not exists
      const newTotalExp = args.expAmount;
      const newLevel = Math.floor(newTotalExp / 100) + 1;
      await ctx.db.insert("users", {
        deviceId: args.deviceId,
        totalExp: newTotalExp,
        level: newLevel,
      });
    } else {
      // Update user
      const newTotalExp = user.totalExp + args.expAmount;
      // Formula: setiap 100 EXP = 1 Level
      const newLevel = Math.floor(newTotalExp / 100) + 1;
      
      await ctx.db.patch(user._id, {
        totalExp: newTotalExp,
        level: newLevel,
      });
    }
  },
});
