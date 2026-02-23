import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (should be in .env)
// For now, using a placeholder if not set, or you can hardcode temporarily for testing if strictly necessary (not recommended for production).
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export const analyzeMeal = async (description) => {
    if (!genAI) {
        throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-001" });

        const prompt = `
      Analyze the nutritional content of the following meal description: "${description}".
      Provide a JSON object with the following keys:
      - name: A short, concise name for the meal (string).
      - calories: Total calories (number).
      - protein: Protein in grams (number).
      - carbs: Carbohydrates in grams (number).
      - fat: Fat in grams (number).
      - ... any other significant nutrients found (e.g., fiber, sugar, sodium, cholesterol, saturated_fat, iron, calcium, etc.). Use snake_case for keys. Values should be numbers (grams or mg as appropriate, but just height number).
      
      Return ONLY the JSON. Do not include markdown formatting (like \`\`\`json).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code block markers if the model adds them
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error analyzing meal with AI:", error);
        throw new Error("Failed to analyze meal. Please try again or enter manually.");
    }
};
