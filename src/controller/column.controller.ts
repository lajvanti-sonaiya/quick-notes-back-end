import { Request, Response } from "express";
import Column from "../models/column.model.js";
import {
  formaterrorResponse,
  formatSuccessResponse,
} from "../utills/response.js";
import Note from "../models/note.model.js";

export const createClounm = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const lastColunm = await Column.findOne().sort({ order: -1 });
    const newOrder = lastColunm ? Number(lastColunm?.order || 0) + 1 : 1;

    const column = await new Column({
      name,
      order: newOrder,
    });
    await column.save();
    return res
      .status(201)
      .json(formatSuccessResponse(column, "column created successfunotelly"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while creating column"));
  }
};

export const getClounms = async (req: Request, res: Response) => {
  try {
    const columns = await Column.find().sort({ order: 1 });
    return res
      .status(200)
      .json(formatSuccessResponse(columns, "column fetched successfunotelly"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while fetching column"));
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const column = await Column.findByIdAndUpdate(id, { name }, { new: true });

    return res
      .status(200)
      .json(formatSuccessResponse(column, "column updated successfunotelly"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while updating column"));
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Column.findByIdAndDelete(id);
    // delete notes inside the column
    await Note.deleteMany({ columnId: id });
    return res.json({ message: "Column deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while deleting column"));
  }
};

export const reorderColumns = async (req: Request, res: Response) => {
  try {
    const { columns } = req.body;

    if (!Array.isArray(columns)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    const updatePromises = columns.map((column) => ({
      updateOne: {
        filter: { _id: column._id },
        update: {
          order: column.order,
        },
      },
    }));

    await Column.bulkWrite(updatePromises);

    return res
      .status(200)
      .json(formatSuccessResponse(columns, "Columns reordered successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(formaterrorResponse(error, "error while updating column"));
  }
};
