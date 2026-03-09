require('dotenv').config();
const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
const Class = require('./models/Class');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const user = await User.findOne({ role: 'user' });
        const yogaClass = await Class.findOne();

        if (!user || !yogaClass) throw new Error("Missing user or class");

        console.log("Attempting to create Attendance block...");
        const record = await Attendance.create({
            userId: user._id,
            classId: yogaClass._id,
            date: new Date().toISOString(),
            status: 'present'
        });
        console.log("Success:", record);
    } catch (err) {
        console.error("Schema Error:", err);
    } finally {
        process.exit();
    }
});
