const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  wellnessGoal: {
    type: String,
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  preferredTime: {
    type: String,
    enum: ['Morning', 'Evening'],
  },
  dietPreference: {
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Balanced'],
    default: 'Balanced',
  },
  timeAvailable: {
    type: Number, // in minutes
    default: 30,
  },
  coachPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoachPlan',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
