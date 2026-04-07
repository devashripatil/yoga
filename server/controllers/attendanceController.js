const Attendance = require('../models/Attendance');

// @desc    Get all attendance records for logged in user
// @route   GET /api/attendance
// @access  Private
const getUserAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendance = await Attendance.find({ userId })
      .populate('classId')
      .sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get attendance for a specific class (Admin)
// @route   GET /api/attendance/class/:classId
// @access  Private/Admin
const getAttendanceByClass = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { classId: req.params.classId };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email');
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark attendance for a user (Admin)
// @route   POST /api/attendance
// @access  Private/Admin
const markAttendance = async (req, res) => {
  try {
    const { userId, classId, date, status } = req.body;

    // Normalize date to start of day for comparison and storage
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(normalizedDate);
    nextDay.setDate(normalizedDate.getDate() + 1);

    // Find if record exists for this user, class and day
    let record = await Attendance.findOne({ 
      userId, 
      classId, 
      date: { $gte: normalizedDate, $lt: nextDay } 
    });

    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = await Attendance.create({ 
        userId, 
        classId, 
        date: normalizedDate, 
        status 
      });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', details: error.message });
  }
};

module.exports = {
  getUserAttendance,
  getAttendanceByClass,
  markAttendance
};
