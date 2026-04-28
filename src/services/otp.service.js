const { OtpLog } = require("../models");

// 🔹 SEND OTP
const sendOtpService = async (body) => {
  console.log("Received body in sendOtpService:", body);
  const branchCode = body.branchCode || body.branch_code;

  if (!branchCode) {
    return {
      success: false,
      message: "branchCode is required!"
    };
  }

  const lastOtp = await OtpLog.findOne({
    where: { branch_code: branchCode },
    order: [["createdAt", "DESC"]],
  });

  if (lastOtp) {
    const diff = (new Date() - new Date(lastOtp.createdAt)) / 1000;

    if (diff < 120) {
      return {
        success: false,
        message: "Next SMS will be send after 2 min!"
      };
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);

  await OtpLog.create({
    branch_code: branchCode,
    otp,
    expiry_time: expiry
  });

  console.log("OTP:", otp); // test

  return {
    success: true,
    message: "OTP sent successfully"
  };
};

// 🔹 VERIFY OTP
const verifyOtpService = async (body) => {
  const branchCode = body.branchCode || body.branch_code;
  const { otp } = body;

  if (!branchCode || !otp) {
    return {
      success: false,
      message: "branchCode and otp are required!"
    };
  }

  const record = await OtpLog.findOne({
    where: {
      branch_code: branchCode,
      otp,
      is_verified: false
    },
    order: [["createdAt", "DESC"]],
  });

  if (!record) {
    return {
      success: false,
      message: "Invalid OTP"
    };
  }

  if (new Date() > new Date(record.expiry_time)) {
    return {
      success: false,
      message: "OTP expired"
    };
  }

  record.is_verified = true;
  await record.save();

  return {
    success: true,
    message: "OTP verified successfully"
  };
};

// 🔹 REVENUE DATA
const getRevenueService = async (query) => {
  const branchCode = query.branchCode || query.branch_code;

  if (!branchCode) {
    return {
      success: false,
      message: "branchCode is required!"
    };
  }

  const verified = await OtpLog.findOne({
    where: {
      branch_code: branchCode,
      is_verified: true
    },
    order: [["createdAt", "DESC"]],
  });

  if (!verified) {
    return {
      success: false,
      message: "OTP verification required"
    };
  }

  return {
    success: true,
    message: "Revenue data fetched",
    result: {
      ytdRevenue: 50000,
      mtdRevenue: 12000,
      clients: 25
    }
  };
};

module.exports = {
  sendOtpService,
  verifyOtpService,
  getRevenueService
};
