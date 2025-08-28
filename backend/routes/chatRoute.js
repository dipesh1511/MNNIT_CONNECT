import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

// Initialize Google Gemini-Pro AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.use(cors());

// Chatbot API Route
router.post("/", async (req, res) => {
    //console.log("Chatbot API hit");  
    try {
        const { message } = req.body;
       //console.log("Received message:", message); 

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        
        const result = await model.generateContent(message);
        //console.log("Generated result:", result); 

        const response = await result.response.text();
       //console.log("Bot Reply:", response); 

        res.json({ reply: response });
    } catch (error) {
        console.error("Error in chatbot:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
