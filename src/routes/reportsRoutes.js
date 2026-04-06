const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @route  GET /api/reports/holdings?client_code=&date=
 * @desc   Get holdings for manager's clients
 * @access Protected
 */
router.get('/holdings', authenticate, reportsController.getHoldings);

/**
 * @route  GET /api/reports/positions?type=open|global|fo_global&client_code=
 * @desc   Get positions filtered by type
 * @access Protected
 */
router.get('/positions', authenticate, reportsController.getPositions);

module.exports = router;
