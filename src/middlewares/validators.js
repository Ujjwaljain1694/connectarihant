const { body } = require('express-validator');

const validateManagerId = body('manager_id')
  .trim()
  .notEmpty().withMessage('manager_id is required.')
  .isLength({ min: 9, max: 9 }).withMessage('manager_id must be exactly 9 characters.')
  .isAlphanumeric().withMessage('manager_id must contain only letters and numbers.');

const validateOTP = body('otp')
  .trim()
  .notEmpty().withMessage('OTP is required.')
  .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
  .isNumeric().withMessage('OTP must be numeric.');

const loginValidation = [validateManagerId];
const verifyOtpValidation = [validateManagerId, validateOTP];
const resendOtpValidation = [validateManagerId];

module.exports = { loginValidation, verifyOtpValidation, resendOtpValidation };
