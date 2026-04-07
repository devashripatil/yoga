const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Notification = require('../models/Notification');

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    // Verify the user is requesting their own bookings OR we just get the user from token
    const userId = req.user.id;

    const bookings = await Booking.find({ userId }).populate('classId');
    res.status(200).json({ count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { classId, sessions, paymentProof, paymentMethod, amountPaid } = req.body;

    // Check if class exists
    const singleClass = await Class.findById(classId);
    if (!singleClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check for duplicate active booking
    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      classId,
      status: 'active'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    // Check capacity limit
    const activeBookingsCount = await Booking.countDocuments({
      classId,
      status: { $in: ['active', 'confirmed', 'pending'] }
    });

    if (activeBookingsCount >= singleClass.maxSlots) {
      return res.status(400).json({ message: 'Class is full' });
    }

    const chosenSessions = sessions || 1;
    const totalAmount = amountPaid || (singleClass.feePerSession * chosenSessions);

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      classId,
      sessions: chosenSessions,
      totalAmount,
      amountPaid: totalAmount,
      paymentProof,
      paymentMethod: paymentMethod || 'upi',
      status: 'pending'
    });

    // Emit socket event for new booking request
    const io = req.app.get('io');
    if (io) {
      io.emit('newBookingRequest', { booking });
    }

    // Create notification
    await Notification.create({
      userId: req.user.id,
      message: `Successfully booked class: ${singleClass.title}`
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:bookingId
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('classId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user owns the booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      message: `Cancelled booking for: ${booking.classId.title}`
    });

    res.status(200).json({ id: req.params.bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('classId', 'title schedule');
    res.status(200).json({ count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel any booking (Admin)
// @route   DELETE /api/bookings/admin/:bookingId
// @access  Private/Admin
const cancelAnyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('classId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Create notification for the user
    await Notification.create({
      userId: booking.userId,
      message: `Your booking for ${booking.classId.title} was cancelled by an admin.`
    });

    res.status(200).json({ id: req.params.bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify/Reject a booking (Admin)
// @route   PUT /api/bookings/:bookingId/verify
// @access  Private/Admin
const verifyBooking = async (req, res) => {
  try {
    const { status, meetingLink } = req.body; // 'confirmed' or 'rejected'
    const booking = await Booking.findById(req.params.bookingId).populate('classId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (meetingLink) {
      booking.meetingLink = meetingLink;
    }
    await booking.save();

    // Create notification for the user
    await Notification.create({
      userId: booking.userId,
      message: `Your booking for ${booking.classId.title} was ${status}.`
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('bookingStatusUpdated', { bookingId: booking._id, status });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUserBookings,
  createBooking,
  verifyBooking,
  cancelBooking,
  getAllBookings,
  cancelAnyBooking
};
