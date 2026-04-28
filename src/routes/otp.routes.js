const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.controller");

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.get("/revenue-data", otpController.getRevenue);

module.exports = router;
