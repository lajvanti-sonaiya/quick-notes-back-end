import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import type { Request, Response } from "express";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);
    console.log("🚀 ~ syncUser ~ clerkId:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to sync user" });
  }
};
