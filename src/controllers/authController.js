const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }
    const { manager_id } = req.body;
    const result = await authService.initiateLogin(manager_id.toUpperCase());
    return sendSuccess(res, result, 'OTP sent successfully.');
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }
    const { manager_id, otp } = req.body;
    const result = await authService.verifyOTP(manager_id.toUpperCase(), otp);
    return sendSuccess(res, result, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }
    const { manager_id } = req.body;
    const result = await authService.resendOTP(manager_id.toUpperCase());
    return sendSuccess(res, result, 'OTP resent successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { login, verifyOtp, resendOtp };
