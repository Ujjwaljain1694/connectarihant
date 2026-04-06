require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Manager, OTP } = require('../models');
const { generateOTP, getOTPExpiry, isOTPCooldownActive, getRemainingCooldown } = require('../utils/otpHelper');

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
const OTP_COOLDOWN_SECONDS = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 30;

/**
 * Step 1: Initiate login — validate manager and generate OTP
 */
const initiateLogin = async (manager_id) => {
  const manager = await Manager.findByPk(manager_id);
  if (!manager) {
    throw { status: 404, message: 'Manager ID not found. Please contact your administrator.' };
  }
  if (!manager.is_active) {
    throw { status: 403, message: 'Your account is inactive. Please contact support.' };
  }

  // Check existing OTP for cooldown
  const existingOTP = await OTP.findOne({
    where: { manager_id, is_used: false },
    order: [['createdAt', 'DESC']],
  });

  if (existingOTP && isOTPCooldownActive(existingOTP.last_sent_at, OTP_COOLDOWN_SECONDS)) {
    const remaining = getRemainingCooldown(existingOTP.last_sent_at, OTP_COOLDOWN_SECONDS);
    throw { status: 429, message: `Please wait ${remaining} seconds before requesting a new OTP.`, remainingSeconds: remaining };
  }

  // Invalidate all old OTPs for this manager
  await OTP.update({ is_used: true }, { where: { manager_id, is_used: false } });

  const otp = generateOTP();
  const expires_at = getOTPExpiry(OTP_EXPIRY_MINUTES);

  await OTP.create({
    manager_id,
    otp,
    expires_at,
    last_sent_at: new Date(),
    is_used: false,
  });

  // In production, send OTP via SMS/Email here
  // For dev/test, we log it
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔐 OTP for ${manager_id}: ${otp}\n`);
  }

  return {
    message: 'OTP sent successfully.',
    manager_name: manager.name,
    // Only expose in development for testing
    ...(process.env.NODE_ENV === 'development' && { otp_dev_only: otp }),
  };
};

/**
 * Step 2: Verify OTP and issue JWT
 */
const verifyOTP = async (manager_id, otp) => {
  const record = await OTP.findOne({
    where: { manager_id, is_used: false },
    order: [['createdAt', 'DESC']],
  });

  if (!record) {
    throw { status: 400, message: 'No active OTP found. Please request a new one.' };
  }

  if (record.otp !== otp) {
    throw { status: 400, message: 'Invalid OTP. Please try again.' };
  }

  if (new Date() > new Date(record.expires_at)) {
    throw { status: 400, message: 'OTP has expired. Please request a new one.' };
  }

  // Mark OTP as used
  await record.update({ is_used: true });

  const manager = await Manager.findByPk(manager_id);

  const payload = {
    manager_id: manager.manager_id,
    name: manager.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  return {
    token,
    expires_in: process.env.JWT_EXPIRES_IN || '8h',
    manager: {
      manager_id: manager.manager_id,
      name: manager.name,
      phone: manager.phone,
    },
  };
};

/**
 * Resend OTP with cooldown enforcement
 */
const resendOTP = async (manager_id) => {
  const manager = await Manager.findByPk(manager_id);
  if (!manager) {
    throw { status: 404, message: 'Manager ID not found.' };
  }

  const existingOTP = await OTP.findOne({
    where: { manager_id, is_used: false },
    order: [['createdAt', 'DESC']],
  });

  if (existingOTP && isOTPCooldownActive(existingOTP.last_sent_at, OTP_COOLDOWN_SECONDS)) {
    const remaining = getRemainingCooldown(existingOTP.last_sent_at, OTP_COOLDOWN_SECONDS);
    throw {
      status: 429,
      message: `Too many requests. Please wait ${remaining} seconds.`,
      remainingSeconds: remaining,
    };
  }

  // Invalidate old OTPs
  await OTP.update({ is_used: true }, { where: { manager_id, is_used: false } });

  const otp = generateOTP();
  const expires_at = getOTPExpiry(OTP_EXPIRY_MINUTES);

  await OTP.create({
    manager_id,
    otp,
    expires_at,
    last_sent_at: new Date(),
    is_used: false,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔄 Resent OTP for ${manager_id}: ${otp}\n`);
  }

  return {
    message: 'OTP resent successfully.',
    ...(process.env.NODE_ENV === 'development' && { otp_dev_only: otp }),
  };
};

module.exports = { initiateLogin, verifyOTP, resendOTP };
