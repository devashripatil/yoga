const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('./models/Class');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedClasses = [
  {
    title: 'Morning Vinyasa Flow',
    description: 'Start your day with an energizing sequence designed to awaken the body and focus the mind. Perfect for all levels.',
    duration: 60,
    schedule: new Date(new Date().setHours(new Date().getHours() + 24)).toISOString(),
    difficulty: 'All Levels',
    maxSlots: 15
  },
  {
    title: 'Restorative Yin Yoga',
    description: 'Deep, slow stretching targeting the connective tissues. Hold poses longer for maximum release and relaxation.',
    duration: 75,
    schedule: new Date(new Date().setHours(new Date().getHours() + 48)).toISOString(),
    difficulty: 'Beginner',
    maxSlots: 12
  },
  {
    title: 'Power Core Yoga',
    description: 'A vigorous flow focusing on core strength, balance, and stamina. Prepare to sweat and challenge yourself.',
    duration: 60,
    schedule: new Date(new Date().setHours(new Date().getHours() + 72)).toISOString(),
    difficulty: 'Intermediate',
    maxSlots: 20
  }
];

const importData = async () => {
  try {
    await Class.deleteMany();
    await Class.insertMany(seedClasses);
    console.log('Classes Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

importData();
