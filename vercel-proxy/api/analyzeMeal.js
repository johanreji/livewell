import { GoogleGenerativeAI } from "@google/generative-ai";

// This runs server-side only — the key is never sent to the browser
const API_KEY = process.env.GEMINI_API_KEY;

const ALLOWED_ORIGINS = [
    "https://livewell-159f8.web.app",
    "https://livewell-159f8.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:5174"
];

function setCors(req, res) {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
    setCors(req, res);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate API key is configured
    if (!API_KEY) {
        console.error("GEMINI_API_KEY environment variable is not set");
        return res.status(500).json({ error: "Server configuration error" });
    }

    try {
        const { description } = req.body;

        if (!description || typeof description !== "string") {
            return res.status(400).json({ error: "Missing or invalid 'description' field" });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-001" });

        const prompt = `
      Analyze the nutritional content of the following meal description: "${description}".
      Provide a JSON object with the following keys:
      - name: A short, concise name for the meal (string).
      - calories: Total calories (number).
      - protein: Protein in grams (number).
      - carbs: Carbohydrates in grams (number).
      - fat: Fat in grams (number).
      - ... any other significant nutrients found (e.g., fiber, sugar, sodium, cholesterol, saturated_fat, iron, calcium, etc.). Use snake_case for keys. Values should be numbers (grams or mg as appropriate, but just the number).
      
      Return ONLY the JSON. Do not include markdown formatting (like \`\`\`json).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code block markers
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanText);

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error analyzing meal:", error);
        return res.status(500).json({ error: "Failed to analyze meal. Please try again." });
    }
}
