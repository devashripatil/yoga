const express = require('express');
const router = express.Router();
const { getUserAttendance, getAttendanceByClass, markAttendance } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserAttendance).post(protect, admin, markAttendance);
router.route('/class/:classId').get(protect, admin, getAttendanceByClass);

module.exports = router;
