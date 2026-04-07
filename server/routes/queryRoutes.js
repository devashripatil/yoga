const express = require('express');
const router = express.Router();
const {
    createQuery,
    getMyQueries,
    getAllQueries,
    updateQueryStatus,
    addMessage
} = require('../controllers/queryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createQuery);
router.get('/my', protect, getMyQueries);
router.get('/', protect, admin, getAllQueries);
router.put('/:id', protect, admin, updateQueryStatus);
router.post('/:id/messages', protect, addMessage);

module.exports = router;
