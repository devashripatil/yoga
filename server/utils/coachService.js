const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const CoachPlan = require('../models/CoachPlan');

const generateWellnessPlan = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Gather progress/context
        const previousBookings = await Booking.find({ user: userId }).populate('classId');
        const bookedClassTitles = previousBookings.map(b => b.classId?.title).filter(Boolean).join(', ') || 'None';
        const completedCount = previousBookings.filter(b => b.status === 'completed').length;

        // Gather available classes for recommendations
        const availableClasses = await Class.find({});
        const classListInfo = availableClasses.map(c => `- ${c.title} (${c.difficulty}, ${c.duration} mins, Category: ${c.category})`).join('\n');

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            throw new Error('Gemini API key is not configured');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "You are a personalized AI Wellness Coach, Yoga Instructor, and Dietitian. Your tone is supportive, motivational, and highly focused on the user's specific goals. Provide practical, daily actionable advice. Do not provide medical diagnoses."
        });

        const prompt = `
Create a comprehensive, personalized daily wellness plan for the user based on their profile and progress.

User Profile:
- Name: ${user.name}
- Wellness Goal: ${user.wellnessGoal || 'Overall Wellness'}
- Experience Level: ${user.experienceLevel || 'Beginner'}
- Preferred Practice Time: ${user.preferredTime || 'Anytime'}
- Diet Preference: ${user.dietPreference || 'Balanced'}
- Daily Time Available for Practice: ${user.timeAvailable || 30} minutes
- Total Completed Yoga Sessions on Platform: ${completedCount}
- Previously Booked Classes: ${bookedClassTitles}

Available Classes on Platform:
${classListInfo}

---
Based on this information, return a JSON object with EXACTLY these four keys:
1. "yogaRoutine": A markdown-formatted daily yoga routine (Warm-up, Main flow, Cool-down) that fits within their ${user.timeAvailable} minutes limit. Be specific with poses.
2. "dietPlan": A markdown-formatted 1-day meal plan (Breakfast, Lunch, Dinner, Snacks) adhering to a ${user.dietPreference} diet and supporting their goal of ${user.wellnessGoal}.
3. "weeklySummary": A short paragraph (text) evaluating their progress (they have completed ${completedCount} sessions) and offering motivation for the days ahead.
4. "recommendedClassTitles": An array of exactly 2 strings, which MUST exactly match titles from the "Available Classes on Platform" list above, representing the best classes for them right now.

OUTPUT ONLY VALID JSON. Do not include markdown codeblocks or any other text outside the JSON object.
`;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();
        
        // Clean JSON
        aiResponse = aiResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        
        let planData;
        try {
            planData = JSON.parse(aiResponse);
        } catch (e) {
            console.error("Failed to parse AI Coach JSON:", aiResponse);
            throw new Error('AI returned malformed JSON');
        }

        // Map recommended titles back to Class ObjectIds
        const recommendedClassIds = availableClasses
            .filter(c => planData.recommendedClassTitles && planData.recommendedClassTitles.includes(c.title))
            .map(c => c._id);

        // Save new plan to DB
        const newPlan = await CoachPlan.create({
            user: userId,
            yogaRoutine: planData.yogaRoutine || 'Routine generating...',
            dietPlan: planData.dietPlan || 'Diet plan generating...',
            weeklySummary: planData.weeklySummary || 'Keep up the good work!',
            recommendedClasses: recommendedClassIds
        });

        // Update user to point to their active plan
        user.coachPlan = newPlan._id;
        await user.save();

        return newPlan;

    } catch (error) {
        console.error("CoachService Error:", error.message);
        throw error;
    }
};

module.exports = {
    generateWellnessPlan
};
