import express from "express";
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
//   uploadTaskImage,
//   deleteTaskImages,
} from "../controller/task.controller.js";

import { taskAddValidation, taskUpdateValidation } from "../validation/task.validation.js";
import { validate } from "../middleware/validate.js";


const router = express.Router();

// Create task
router.post("/", validate(taskAddValidation), createTask);

// Get tasks
router.get("/", getTask);

// Update task order
router.patch("/updateTaskOrder", updateTaskOrder);

// Update task
router.patch("/:id", validate(taskUpdateValidation), updateTask);

// Delete task
router.delete("/:id", deleteTask);

// Upload images
// router.post(
//   "/imageUpload",
//   upload.array("images"),
//   uploadFileToClodinary,
//   uploadTaskImage,
// );

// Delete images
// router.post("/images/delete", deleteTaskImages);

export default router;