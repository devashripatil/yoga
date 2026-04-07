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
    bankAccount: {
        type: String,
    },
    accountHolder: {
        type: String,
    },
    ifscCode: {
        type: String,
    },
    bankName: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
