import type { Request, Response, NextFunction } from "express";
import redis from "../utills/redis/redisConnection.js";
import { clearNotesCache } from "../utills/redis/redisHelper.js";
import { formatSuccessResponse } from "../utills/response.js";
import Note from "../models/note.model.js"

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await new Note(req.body);
    await note.save();

    const io = req.app.get("io");
    io.emit("note:created", note);

    // clear redis cache
    await clearNotesCache();

    return res
      .status(201)
      .json(formatSuccessResponse(note, "Note created successfully"));
  } catch (error) {
    console.log("🚀 ~ createNote ~ error:", error);
    next(error);
  }
};

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, page, limit } = req.query;
    let filter: Record<string, any> = { isDeleted: false };

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
        .sort({ isPinned: -1, createdAt: -1 })
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
    console.log("🚀 ~ getNote ~ error:", error);
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
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
    console.log("🚀 ~ updateNote ~ error:", error);
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
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
    console.log("🚀 ~ deleteNote ~ deletedNote:", deletedNote);

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
    console.log("🚀 ~ deleteNote ~ error:", error);
    next(error);
  }
};

