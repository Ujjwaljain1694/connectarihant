const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @route  GET /api/dashboard/stats
 * @desc   Get aggregated client stats for logged-in manager
 * @access Protected
 */
router.get('/stats', authenticate, dashboardController.getStats);

module.exports = router;
