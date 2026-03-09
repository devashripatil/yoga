require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/User');
const Class = require('./models/Class');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('classId', 'title schedule');

        console.log(JSON.stringify(bookings, null, 2));
    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        process.exit();
    }
});
