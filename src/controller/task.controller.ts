import { Request, Response } from "express";
import Task from "../models/task.model.js";
import { formaterrorResponse, formatSuccessResponse } from "../utills/response.js";

// Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, columnId } = req.body;
    const lastTask = await Task.findOne({ columnId }).sort({ orderId: -1 });
    const orderId = lastTask ? lastTask.orderId + 1 : 1;

    const task = await Task.create({
      title,
      description,
      columnId,
      orderId,
    });

    return res
      .status(201)
      .json(formatSuccessResponse(task, "Task created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "Error while creating task"));
  }
};


// Get Tasks
export const getTask = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ isDeleted: false }).sort({ orderId: 1 });

    return res
      .status(200)
      .json(formatSuccessResponse(tasks, "Tasks fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "Error while fetching tasks"));
  }
};


// Update Task Order
export const updateTaskOrder = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    const bulkOperations = tasks.map((task) => ({
      updateOne: {
        filter: { _id: task._id },
        update: {
          orderId: task.orderId,
          columnId: task.columnId,
        },
      },
    }));

    await Task.bulkWrite(bulkOperations);

    return res
      .status(200)
      .json(formatSuccessResponse(tasks, "Tasks reordered successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "Error while updating task order"));
  }
};


// Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!task) {
      return res
        .status(404)
        .json(formaterrorResponse(null, "Task not found"));
    }

    return res
      .status(200)
      .json(formatSuccessResponse(task, "Task updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "Error while updating task"));
  }
};


// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json(formaterrorResponse(null, "Task not found"));
    }

    return res
      .status(200)
      .json(formatSuccessResponse(task, "Task deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "Error while deleting task"));
  }
};