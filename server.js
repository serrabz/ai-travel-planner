import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Gemini SDK with API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
app.post('/api/travel-plan', async (req, res) => {
  try {
    const { destination, days, budget } = req.body;

    // Solo Female & Safety-First Prompt
    const prompt = `
      You are an expert AI Travel & Safety Planner specializing in safe itineraries for solo travelers and female safety-conscious tourists.
     
      Create a detailed ${days}-day travel itinerary for ${destination} with a budget level of "${budget}".
     
      For each day:
      1. Recommend verified, well-lit accommodations and safe neighborhood areas.
      2. Highlight key safety tips (safe areas vs. streets/neighborhoods to avoid at night).
      3. Outline structured daytime activities, verified group tours, and safe local transport options.
      4. Include local emergency numbers, safe rideshare options, and night transport guidelines.
     
      Format the output clearly with Markdown headings, bullet points, and daily safety callouts.
    `;

    // Call Gemini 2.5 Flash model
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 