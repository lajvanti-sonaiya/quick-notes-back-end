import type { Request, Response, NextFunction } from "express";
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

const getNote = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { category, search, page, limit } = req.query;
    let filter :Record<string, any>= {};

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
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

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Note.countDocuments(filter),
    ]);

    console.log("🚀 ~ getNote ~ filter:", filter);
    console.log("🚀 ~ getNote ~ notes:", notes.length);

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

const updateNote = async (req:Request, res:Response, next:NextFunction) => {
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

const deleteNote = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id } = req.params;

    const deletedNote = await Note.findByIdAndDelete(id);
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
