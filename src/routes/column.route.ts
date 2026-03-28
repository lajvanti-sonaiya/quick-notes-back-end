import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { createClounm, deleteColumn, getClounms, reorderColumns, updateColumn } from "../controller/column.controller.js";

const router = express.Router();
router.get("/",getClounms)
router.post("/create", isAdmin,createClounm);
router.put("/reorder", isAdmin, reorderColumns);
router.put("/:id", isAdmin, updateColumn);
router.delete("/:id",isAdmin,deleteColumn)

export default router;


