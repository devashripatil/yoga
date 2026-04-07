const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed', 'pending', 'confirmed', 'rejected'],
    default: 'pending',
  },
  sessions: {
    type: Number,
    default: 1,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  paymentProof: {
    type: String, // URL or path to image
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'cash'],
    default: 'upi'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  meetingLink: {
    type: String,
    default: ''
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
