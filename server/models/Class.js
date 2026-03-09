const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  schedule: {
    type: String, // e.g., "Monday, 8:00 AM"
    required: true,
  },
  difficulty: {
    type: String, // e.g., "Beginner", "Intermediate", "All Levels"
    required: true,
  },
  maxSlots: {
    type: Number,
    required: true,
    default: 15,
  },
  category: {
    type: String,
    enum: ['Yoga', 'Meditation', 'Breathing'],
    default: 'Yoga',
  },
  feePerSession: {
    type: Number,
    default: 0,
  },
  totalSessions: {
    type: Number,
    default: 1,
  },
  imageUrl: {
    type: String,
  },
  instructor: {
    type: String,
    default: 'Admin',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);
