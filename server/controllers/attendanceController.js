const Attendance = require('../models/Attendance');

// @desc    Get all attendance records for logged in user
// @route   GET /api/attendance/user/:userId
// @access  Private
const getUserAttendance = async (req, res) => {
  try {
    // Verify the user is requesting their own attendance OR we just get the user from token
    const userId = req.user.id;

    const attendance = await Attendance.find({ userId }).populate('classId');
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
    const attendance = await Attendance.find({ classId: req.params.classId })
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

    let record = await Attendance.findOne({ userId, classId, date });

    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = await Attendance.create({ userId, classId, date, status });
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
