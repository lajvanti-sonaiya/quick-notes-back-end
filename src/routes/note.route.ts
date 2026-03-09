import {
  createNote,
  getNote,
  updateNote,
  deleteNote,
  updateNotesOrder,
  uploadNoteFile,
} from "../controller/note.controller.js";
import {
  noteAddValidation,
  noteUpdateValidation,
} from "../validation/note.validation.js";
import { validate } from "../middleware/validate.js";
import { Router, Request, Response } from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadFileToClodinary } from "../middleware/uploadFileToClodinary.js";

const router = Router();

// Create a new note
router.post("/", validate(noteAddValidation), createNote);

// Get all notes
router.get("/", getNote);

//update notes order
router.patch("/updateNotesOrder", updateNotesOrder);

// Update a note by ID
router.patch("/:id", validate(noteUpdateValidation), updateNote);

// Delete a note by ID
router.delete("/:id", deleteNote);

//Upload img
router.post(
  "/imageUpload",
  upload.array("images"),
  uploadFileToClodinary,
  uploadNoteFile,
);
export default router;
