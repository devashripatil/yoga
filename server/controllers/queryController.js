const Query = require('../models/Query');

// @desc    Submit a query
// @route   POST /api/queries
// @access  Private
const createQuery = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        if (!req.user) {
            return res.status(401).json({ message: 'User context and authentication missing' });
        }

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const query = await Query.create({
            user: req.user._id || req.user.id,
            subject,
            messages: [{
                sender: 'user',
                message: message
            }],
            status: 'Pending'
        });
        res.status(201).json({ data: query });
    } catch (error) {
        console.error('Query Creation Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get current user's queries
// @route   GET /api/queries/my
// @access  Private
const getMyQueries = async (req, res) => {
    try {
        const queries = await Query.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ data: queries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all queries (Admin)
// @route   GET /api/queries
// @access  Private/Admin
const getAllQueries = async (req, res) => {
    try {
        const queries = await Query.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ data: queries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update query status/reply (Admin)
// @route   PUT /api/queries/:id
// @access  Private/Admin
const updateQueryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const query = await Query.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }
        res.status(200).json({ data: query });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a message to a conversation
// @route   POST /api/queries/:id/messages
// @access  Private
const addMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const queryId = req.params.id;

        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Determine sender (admin or user)
        const sender = req.user.role === 'admin' ? 'admin' : 'user';

        // Security: If not admin, verify user owns this query
        if (req.user.role !== 'admin' && query.user.toString() !== (req.user._id || req.user.id).toString()) {
            return res.status(403).json({ message: 'Not authorized to reply to this query' });
        }

        // Auto-update status when admin replies
        let newStatus = query.status;
        if (sender === 'admin' && query.status === 'Pending') {
            newStatus = 'In Progress';
        }

        query.messages.push({
            sender,
            message,
            createdAt: new Date()
        });
        
        query.status = newStatus;
        await query.save();

        res.status(200).json({ data: query });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createQuery,
    getMyQueries,
    getAllQueries,
    updateQueryStatus,
    addMessage
};
