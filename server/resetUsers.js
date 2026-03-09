const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log("Removing all users except the known admin...");
        await User.deleteMany({ email: { $ne: 'admin@sattvayoga.com' } });
        console.log("Done.");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
});
