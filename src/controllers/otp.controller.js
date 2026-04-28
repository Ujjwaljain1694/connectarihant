const otpService = require("../services/otp.service");

const sendOtp = async (req, res) => {
  try {
    const data = await otpService.sendOtpService({ ...req.body, ...req.query });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const data = await otpService.verifyOtpService({ ...req.body, ...req.query });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const data = await otpService.getRevenueService(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  getRevenue
};
