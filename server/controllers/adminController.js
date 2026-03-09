const User = require('../models/User');
const Class = require('../models/Class');
const Booking = require('../models/Booking');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalClasses = await Class.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Bookings this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Today's classes
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    const todaysClassesCount = await Class.countDocuments({
      schedule: { $regex: new RegExp(`^${dayOfWeek}`, 'i') } // Basic approach, can be improved
    });

    res.status(200).json({
      totalUsers,
      totalClasses,
      totalBookings,
      bookingsThisMonth,
      todaysClassesCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats
};
