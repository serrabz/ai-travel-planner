const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Azure OpenAI Configuration
const endpoint = "https://ai-travel-planning-assi-resource.services.ai.azure.com";
const apiKey = process.env.AZURE_OPENAI_KEY;

const deploymentName = "gpt-4.1-mini";

app.post('/api/travel-plan', async (req, res) => {
    try {
        const { destination, days, budget, preferences } = req.body;

        if (!destination || !days) {
            return res.status(400).json({ error: 'Destination and days are required.' });
        }

        const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-01`;

        const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}.
Budget level: ${budget || 'flexible'}.
Preferences: ${preferences || 'general sightseeing'}.
Provide day-by-day recommendations including activities and travel tips.`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are an expert AI Travel Assistant providing structured travel itineraries.' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Azure API request failed');
        }

        const itinerary = data.choices[0].message.content;
        res.json({ success: true, itinerary });

    } catch (error) {
        console.error('Azure AI Error:', error.message);
        res.status(500).json({ error: 'Failed to generate travel plan.', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 