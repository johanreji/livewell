// Vercel proxy URL for Gemini API calls
const API_URL = import.meta.env.VITE_API_URL;

export const analyzeMeal = async (description) => {
    if (!API_URL) {
        throw new Error("API URL is missing. Please set VITE_API_URL in your .env file.");
    }

    try {
        const response = await fetch(`${API_URL}/api/analyzeMeal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error analyzing meal with AI:", error);
        throw new Error("Failed to analyze meal. Please try again or enter manually.");
    }
};
