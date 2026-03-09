const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'admin@sattvayoga.com';
        const password = 'password123';

        let adminUser = await User.findOne({ email });

        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            adminUser = await User.create({
                name: 'Super Admin',
                email,
                password: hashedPassword,
                phone: '1234567890',
                role: 'admin'
            });
            console.log(`Created new Admin! Email: ${email}, Password: ${password}`);
        } else {
            adminUser.role = 'admin';
            const salt = await bcrypt.genSalt(10);
            adminUser.password = await bcrypt.hash(password, salt);
            await adminUser.save();
            console.log(`Reset existing Admin! Email: ${email}, Password: ${password}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
