import type { Request, Response, NextFunction } from "express";
import redis from "../utills/redisConnection";
const Note = require("../models/note.model");
const { successResponse } = require("../utills/response");

const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await new Note(req.body);
    await note.save();

    const io = req.app.get("io");
    io.emit("note:created", note);

    return successResponse(res, {
      status: 201,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    console.log("🚀 ~ createNote ~ error:", error);
    next(error);
  }
};

const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, page, limit } = req.query;
    let filter: Record<string, any> = {isDeleted:false};

    const pageNumber = Number(page??0) ;
    const limitNumber = Number(limit??10);
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
      return successResponse(res, {
        message: "Notes fetched successfully (from cache)",
        data: JSON.parse(cached),
      });
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
    await redis.set(redisKey, JSON.stringify(responseData),'EX', 60);

    return successResponse(res, {
      message: notes.length ? "Notes fetched successfully" : "No notes found",
      data: {
        notes,
        total,
        page: pageNumber,
        limit: limitNumber,
      },
    });

    // res.status(200).json({
    //   status: true,
    //   message:
    //     notes.length == 0 ? "note not found" : "note fetched successfully",
    //   data: notes,
    //   total,
    //   page: pageNumber,
    //   limit: limitNumber,
    // });
  } catch (error) {
    console.log("🚀 ~ getNote ~ error:", error);
    next(error);
  }
};

const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedNote) {
      return successResponse(res, {
        status: 404,
        message: "Note not found",
        data: null,
      });
    }

    const io = req.app.get("io");
    io.emit("note:updated", updatedNote);

    return successResponse(res, {
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    console.log("🚀 ~ updateNote ~ error:", error);
    next(error);
  }
};

const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    //hard delete
    // const deletedNote = await Note.findByIdAndDelete(id);

    //soft delete
     const deletedNote = await Note.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true } 
    );
    console.log("🚀 ~ deleteNote ~ deletedNote:", deletedNote);

    if (!deletedNote) {
      return successResponse(res, {
        status: 404,
        message: "Note not found",
        data: null,
      });
    }
    const io = req.app.get("io");
    io.emit("note:deleted", deletedNote);

    return successResponse(res, {
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    console.log("🚀 ~ deleteNote ~ error:", error);
    next(error);
  }
};

module.exports = { createNote, getNote, updateNote, deleteNote };
