const express = require('express');
const router = express.Router();
const { getCoachPlan, generateNewPlan } = require('../controllers/coachController');
const { protect } = require('../middleware/authMiddleware');

router.route('/plan').get(protect, getCoachPlan);
router.route('/generate').post(protect, generateNewPlan);

module.exports = router;
