const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // You can modify the email here if Devashri registers with a specific developer email
    // For now, let's just make the FIRST user in the database an admin as a fallback,
    // or specifically target devashri if we can find her
    const users = await User.find({});
    
    if (users.length > 0) {
      const userToPromote = users[0]; // Upgrading the primary test account
      userToPromote.role = 'admin';
      await userToPromote.save();
      console.log(`Successfully upgraded ${userToPromote.email} to Admin Role!`);
    } else {
      console.log('No users found in database to promote.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

makeAdmin();
