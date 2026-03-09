const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Class = require('../models/Class');

// @desc    Get recommended classes for a user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch user's previous bookings
        const previousBookings = await Booking.find({ user: userId }).populate('classId');
        const bookedClassTitles = previousBookings.map(b => b.classId?.title).filter(Boolean).join(', ') || 'None';

        // Fetch all available classes
        const availableClasses = await Class.find({});
        if (!availableClasses || availableClasses.length === 0) {
            return res.status(200).json({ recommendations: [] });
        }

        const classListInfo = availableClasses.map(c => `- ${c.title} (${c.difficulty}, ${c.duration} mins, Category: ${c.category}, Schedule: ${c.schedule})`).join('\n');

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            // Fallback if no API key is set
            return res.status(200).json({ recommendations: availableClasses.slice(0, 3) });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a yoga instructor recommending yoga classes to users. Based on their goals, experience level, and preferences, suggest the most suitable classes available on the website.

User Profile:
- Name: ${user.name}
- Wellness Goal: ${user.wellnessGoal || 'Not specified'}
- Experience Level: ${user.experienceLevel || 'Not specified'}
- Preferred Time: ${user.preferredTime || 'Not specified'}
- Previously Booked Classes: ${bookedClassTitles}

Available Classes:
${classListInfo}

From the "Available Classes" list, select the 3 most suitable classes for this user. Output ONLY a valid JSON array of the exact class titles matching the available classes list. Example: ["Vinyasa Flow", "Restorative Yoga", "Meditation Basics"]. Do not include any other text.
`;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // Clean up markdown block if present
        aiResponse = aiResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        let recommendedTitles = [];
        try {
            recommendedTitles = JSON.parse(aiResponse);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", aiResponse);
            // Fallback
            return res.status(200).json({ recommendations: availableClasses.slice(0, 3) });
        }

        const recommendedClasses = availableClasses.filter(c => recommendedTitles.includes(c.title));

        res.status(200).json({ recommendations: recommendedClasses });

    } catch (error) {
        console.error("Recommendation Error:", error);
        // Return fallback classes so UI doesn't break
        try {
            const availableClasses = await Class.find({});
            return res.status(200).json({ recommendations: availableClasses.slice(0, 3) });
        } catch (e) {
            res.status(500).json({ message: 'Server error generating recommendations' });
        }
    }
};

module.exports = {
    getRecommendations
};
