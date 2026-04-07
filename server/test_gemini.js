require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    console.log("Testing with GEMINI_API_KEY:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("Available Models:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}

listModels();
