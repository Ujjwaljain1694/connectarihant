const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @route  GET /api/clients?status=active|inactive|new|all
 * @desc   Get all clients for logged-in manager with optional status filter
 * @access Protected
 */
router.get('/', authenticate, clientController.getClients);

module.exports = router;
