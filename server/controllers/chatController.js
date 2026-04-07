const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Handle AI Yoga Chat
// @route   POST /api/yoga-chat
// @access  Public
const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            return res.status(500).json({ error: 'Gemini API Key is missing or invalid on the server.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-2.5-flash based on API key permissions
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a friendly yoga instructor and wellness assistant on a yoga website. Help users with yoga advice, meditation guidance, breathing exercises, and class recommendations. Keep responses simple, supportive, and beginner-friendly. Avoid medical advice. Format your responses with simple markdown spacing."
        });

        const result = await model.generateContent(message);
        const aiResponse = result.response.text();

        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
};

module.exports = {
    handleChat
};
