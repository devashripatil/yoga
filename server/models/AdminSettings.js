const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    upiId: {
        type: String,
        required: true,
    },
    qrCodeUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
