import express from 'express';
import { chatbotReply } from "../controllers/c.js";
import loadFaqData from '../middlewares/c.js';

const router = express.Router();

// Chatbot route using the `loadFaqData` middleware before the controller
router.post('/chat', loadFaqData, chatbotReply);

// Export router as default
export default router;
