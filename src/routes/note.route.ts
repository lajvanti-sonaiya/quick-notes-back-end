import express from "express";
import {
  createNote,
  getNote,
  updateNote,
  deleteNote,
} from "../controller/note.controller.js";
import {
  noteAddValidation,
  noteUpdateValidation,
} from "../validation/note.validation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Create a new note
router.post("/", validate(noteAddValidation), createNote);
// Get all notes
router.get("/", getNote);
// Update a note by ID
router.patch("/:id", validate(noteUpdateValidation), updateNote);
// Delete a note by ID
router.delete("/:id", deleteNote);

export default router;
