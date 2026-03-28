import type { Request, Response, NextFunction } from "express";
import redis from "../utills/redis/redisConnection.js";
import { clearNotesCache } from "../utills/redis/redisHelper.js";
import {
  formaterrorResponse,
  formatSuccessResponse,
} from "../utills/response.js";
import Note from "../models/note.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../utills/cloudinaryConfig.js";

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(401)
        .json(formaterrorResponse(false, "Note created successfunotelly"));
    }

    const lastNote = await Note.findOne({
      clerkId: userId,
      isPinned: false,
      isDeleted: false,
    }).sort({ order: -1 });

    const newOrder = lastNote ? Number(lastNote?.order) + 1 : 1;
    const note = await new Note({
      ...req.body,
      order: newOrder,
      clerkId: userId,
    });
    await note.save();

    console.log("note:created userId", userId);

    const io = req.app.get("io");
    io.to(userId).emit("note:created", note);

    // clear redis cache
    await clearNotesCache();

    return res
      .status(201)
      .json(formatSuccessResponse(note, "Note created successfunotelly"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while creating note"));
  }
};
export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, search, page, limit } = req.query;
    const { userId } = getAuth(req);
    console.log("🚀 ~ getNote ~ userId:", userId);
    if (!userId) return res.status(401).json({ error: "Not signed in" });

    let filter: Record<string, any> = { isDeleted: false, clerkId: userId };

    const pageNumber = Number(page ?? 0);
    const limitNumber = Number(limit ?? 10);
    const skip = pageNumber * limitNumber;

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    //redis key created
    const redisKey = `notes:${JSON.stringify(filter)}:page:${pageNumber}:limit:${limitNumber}`;

    const cached = await redis.get(redisKey);
    if (cached) {
      return res
        .status(200)
        .json(
          formatSuccessResponse(
            JSON.parse(cached),
            "Notes fetched successfully (from cache)",
          ),
        );
    }

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort({ isPinned: -1, order: 1 })
        .skip(skip)
        .limit(limitNumber),

      Note.countDocuments(filter),
    ]);
    const responseData = {
      notes,
      total,
      page: pageNumber,
      limit: limitNumber,
    };

    // if key is not available in redis create new
    await redis.set(redisKey, JSON.stringify(responseData), "EX", 600);

    return res.status(200).json(
      formatSuccessResponse(
        {
          notes,
          total,
          page: pageNumber,
          limit: limitNumber,
        },
        notes.length ? "Notes fetched successfully" : "No notes found",
      ),
    );
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while fetching note"));
  }
};
export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedNote) {
      return res
        .status(404)
        .json(formatSuccessResponse(null, "Note not found"));
    }

    const io = req.app.get("io");
    io.emit("note:updated", updatedNote);

    // clear redis cache
    await clearNotesCache();

    return res
      .status(200)
      .json(formatSuccessResponse(updatedNote, "Note updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while updating note"));
  }
};
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    //hard delete
    // const deletedNote = await Note.findByIdAndDelete(id);

    //soft delete
    const deletedNote = await Note.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );

    if (!deletedNote) {
      return res
        .status(404)
        .json(formatSuccessResponse(null, "Note not found"));
    }
    const io = req.app.get("io");
    io.emit("note:deleted", deletedNote);

    // clear redis cache
    await clearNotesCache();

    return res
      .status(200)
      .json(formatSuccessResponse(deletedNote, "Note deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while deleting note"));
  }
};
export const updateNotesOrder = async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const { userId } = getAuth(req);

    const bulkOps = notes.map((note: any) => ({
      updateOne: {
        filter: { _id: note._id, clerkId: userId, isDeleted: false },
        update: { order: note.order },
      },
    }));
    await Note.bulkWrite(bulkOps);

    const updatedAllNotes = await Note.find({
      clerkId: userId,
      isDeleted: false,
    }).sort({
      order: 1,
    });

    // clear redis cache
    await clearNotesCache();

    const io = req.app.get("io");
    io.emit("note:OrderUpdated", updatedAllNotes);

    return res
      .status(200)
      .json(formatSuccessResponse(null, "Order updated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while updating note order"));
  }
};
export const uploadNoteFile = async (req: Request, res: Response) => {
  if (req.body.cloudinaryUrls) {
    return res
      .status(200)
      .json(
        formatSuccessResponse(
          req.body.cloudinaryUrls,
          "image added successfully",
        ),
      );
  }
};
export const deleteImagesFromCloudinary = async (
  req: Request,
  res: Response,
) => {
  try {
    const { public_ids } = req.body;

    if (!Array.isArray(public_ids) || public_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "public_ids must be a non-empty array",
      });
    }

    const decodedIds = public_ids.map((id) => decodeURIComponent(id));

    const result = await cloudinary.api.delete_resources(decodedIds);
    console.log("🚀 ~ deleteImagesFromCloudinary ~ result:", result);

    return res
      .status(200)
      .json(formatSuccessResponse(result, "Images deleted successfully"));
  } catch (error) {
    console.error("🚀 deleteImagesFromCloudinary error:", error);

    return res.status(500).json({
      success: false,
      message: "Image deletion failed",
    });

    return res
      .status(500)
      .json(formaterrorResponse(error, "error while updating column"));
  }
};
