import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/generate-itinerary', async (req, res) => {
    try {
        const { destination, days, budget, preferences } = req.body;
       
        const prompt = `You are an expert solo female travel safety advisor and professional itinerary planner. Create a detailed, ${days}-day travel itinerary for ${destination}. Budget Level: ${budget}. Preferences: ${preferences}.
       
        CRITICAL REQUIREMENTS:
        1. Emphasize safety, well-lit accommodations, verified safe neighborhoods, and reliable transport options suitable for solo women.
        2. Include specific safety warnings, emergency local numbers, and tips for avoiding common scams in ${destination}.
        3. Format the response clearly with day-by-day breakdowns and a dedicated safety section.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ itinerary: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate safety travel itinerary." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
