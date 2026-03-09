const AdminSettings = require('../models/AdminSettings');

// @desc    Get Admin Settings
// @route   GET /api/admin-settings
// @access  Public (So users can see QR/UPI to pay)
const getAdminSettings = async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = { adminName: 'Admin', upiId: '9373136747@ybl', qrCodeUrl: '' }; // Provide default
        } else {
            // Fallback if document exists but fields are empty
            if (!settings.adminName) settings.adminName = 'Admin';
            if (!settings.upiId) settings.upiId = '9373136747@ybl';
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Admin Settings
// @route   PUT /api/admin-settings
// @access  Private/Admin
const updateAdminSettings = async (req, res) => {
    try {
        const { adminName, upiId, qrCodeUrl } = req.body;

        let settings = await AdminSettings.findOne();

        if (settings) {
            settings.adminName = adminName || settings.adminName;
            settings.upiId = upiId || settings.upiId;
            settings.qrCodeUrl = qrCodeUrl !== undefined ? qrCodeUrl : settings.qrCodeUrl;
            const updatedSettings = await settings.save();
            res.status(200).json(updatedSettings);
        } else {
            settings = await AdminSettings.create({
                adminName,
                upiId,
                qrCodeUrl,
            });
            res.status(201).json(settings);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAdminSettings,
    updateAdminSettings,
};
