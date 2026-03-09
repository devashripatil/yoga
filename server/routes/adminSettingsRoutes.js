const express = require('express');
const router = express.Router();
const { getAdminSettings, updateAdminSettings } = require('../controllers/adminSettingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAdminSettings)
    .put(protect, admin, updateAdminSettings);

module.exports = router;
