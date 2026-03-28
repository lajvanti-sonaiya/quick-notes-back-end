import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { formaterrorResponse } from "../utills/response.js";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json(formaterrorResponse(false, "Admin access required"));
    }

    if (userId) {
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res
          .status(401)
          .json(formaterrorResponse(false, "User not found"));
      }
      if (user.role !== "admin") {
        return res
          .status(403)
          .json(formaterrorResponse(false, "Admin access required"));
      }
      next();
    }
  } catch (error) {
    res.status(500).json(formaterrorResponse(false, "Admin access required"));
  }
};
