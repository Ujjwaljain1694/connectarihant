const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportsController');
const payoutController = require('../controllers/payoutController');
const { authenticate } = require('../middlewares/authMiddleware');
const customUpload = require('../middlewares/rawUpload');

// ================= 💰 CLIENT BALANCE =================
router.get(
  "/client-balance",
  authenticate,
  reportController.getClientBalance
);

module.exports = router;
