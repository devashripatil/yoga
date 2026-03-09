const express = require('express');
const router = express.Router();
const { getUserBookings, createBooking, cancelBooking, getAllBookings, cancelAnyBooking, verifyBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, admin, getAllBookings);
router.route('/my-bookings').get(protect, getUserBookings);
router.route('/:bookingId').delete(protect, cancelBooking);
router.route('/admin/:bookingId').delete(protect, admin, cancelAnyBooking);
router.route('/:bookingId/verify').put(protect, admin, verifyBooking);

module.exports = router;
