const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginValidation, verifyOtpValidation, resendOtpValidation } = require('../middlewares/validators');

/**
 * @route  POST /api/auth/login
 * @desc   Send OTP to manager
 * @access Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route  POST /api/auth/verify-otp
 * @desc   Verify OTP and receive JWT token
 * @access Public
 */
router.post('/verify-otp', verifyOtpValidation, authController.verifyOtp);

/**
 * @route  POST /api/auth/resend-otp
 * @desc   Resend OTP (30-second cooldown enforced)
 * @access Public
 */
router.post('/resend-otp', resendOtpValidation, authController.resendOtp);

module.exports = router;
