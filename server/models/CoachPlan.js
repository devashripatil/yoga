const mongoose = require('mongoose');

const coachPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateGenerated: {
    type: Date,
    default: Date.now,
  },
  yogaRoutine: {
    type: String, // Store as Markdown or structured text
    required: true,
  },
  dietPlan: {
    type: String, // Store as Markdown or structured text
    required: true,
  },
  weeklySummary: {
    type: String, // AI encouragement and assessment
  },
  wellnessSnapshot: {
    type: String, // 1-line catchy routine summary
  },
  recommendedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('CoachPlan', coachPlanSchema);
