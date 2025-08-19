import express from "express";
import { getUserForSidebar, getMessages, sendMessage } from "../controllers/messageController.js";
import protectUserRoute from "../middlewares/authUser.js";

const router = express.Router();

router.get("/connections", protectUserRoute, getUserForSidebar);
router.get("/:id", protectUserRoute, getMessages);
router.post("/send/:id", protectUserRoute, sendMessage);

export default router;
