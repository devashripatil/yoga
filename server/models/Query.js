const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    messages: [
        {
            sender: {
                type: String,
                enum: ['user', 'admin'],
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Query', querySchema);
