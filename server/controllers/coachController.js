const CoachPlan = require('../models/CoachPlan');
const { generateWellnessPlan } = require('../utils/coachService');

// @desc    Get current AI Wellness Plan
// @route   GET /api/coach/plan
// @access  Private
const getCoachPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find the latest plan
        let plan = await CoachPlan.findOne({ user: userId })
            .sort({ dateGenerated: -1 })
            .populate('recommendedClasses');

        // Automatic Trigger: If no plan exists, or the plan is older than 7 days, generate a new one
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (!plan || plan.dateGenerated < oneWeekAgo) {
            console.log("Generating new coach plan automatically for user:", userId);
            plan = await generateWellnessPlan(userId);
            plan = await CoachPlan.findById(plan._id).populate('recommendedClasses'); // Re-fetch to populate
        }

        res.status(200).json(plan);

    } catch (error) {
        console.error("Coach Controller Error:", error);
        res.status(500).json({ message: 'Failed to retrieve or generate wellness plan' });
    }
};

// @desc    Explicitly force generation of a new plan (e.g. after updating preferences)
// @route   POST /api/coach/generate
// @access  Private
const generateNewPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const newPlan = await generateWellnessPlan(userId);
        const populatedPlan = await CoachPlan.findById(newPlan._id).populate('recommendedClasses');
        
        res.status(201).json(populatedPlan);
    } catch (error) {
        console.error("Coach Controller Generation Error:", error);
        res.status(500).json({ message: 'Failed to generate new wellness plan' });
    }
}

module.exports = {
    getCoachPlan,
    generateNewPlan
};
