import express from "express";
import { syncUser } from "../controller/user.controller.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();
// sync user 
router.post("/sync", requireAuth(),syncUser);


export default router;
