require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log("Testing with GEMINI_API_KEY:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Attempting gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Hello");
        console.log("Flash Success:", resultFlash.response.text());
    } catch (e) {
        console.error("Flash Error:", e.message);
    }

    try {
        console.log("Attempting gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Hello");
        console.log("Pro Success:", resultPro.response.text());
    } catch (e) {
        console.error("Pro Error:", e.message);
    }
}

testGemini();
