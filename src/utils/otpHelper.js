/**
 * Generates a cryptographically random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculates OTP expiry date
 * @param {number} minutes - Minutes from now
 */
const getOTPExpiry = (minutes = 10) => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

/**
 * Checks if OTP cooldown is still active
 * @param {Date} lastSentAt - Timestamp of last OTP
 * @param {number} cooldownSeconds - Cooldown in seconds
 */
const isOTPCooldownActive = (lastSentAt, cooldownSeconds = 30) => {
  const now = new Date();
  const diffMs = now - new Date(lastSentAt);
  const diffSeconds = diffMs / 1000;
  return diffSeconds < cooldownSeconds;
};

/**
 * Returns remaining cooldown seconds
 */
const getRemainingCooldown = (lastSentAt, cooldownSeconds = 30) => {
  const now = new Date();
  const diffMs = now - new Date(lastSentAt);
  const diffSeconds = Math.floor(diffMs / 1000);
  return Math.max(0, cooldownSeconds - diffSeconds);
};

module.exports = { generateOTP, getOTPExpiry, isOTPCooldownActive, getRemainingCooldown };
