const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log("Removing all current bookings to reset corrupted test data...");
        await Booking.deleteMany({});
        console.log("Done.");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
});
