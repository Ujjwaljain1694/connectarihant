const reportsService = require('../services/reportsService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const otpStore = require('../utils/otpStore');
const { sequelize } = require('../models');
const moment = require('moment');


// ================= HOLDINGS =================
const getHoldings = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { client_code = null, date = null } = req.query;

    const holdings = await reportsService.getHoldings(manager_id, client_code, date);

    return sendSuccess(
      res,
      { total: holdings.length, holdings },
      'Holdings fetched successfully.'
    );
  } catch (err) {
    next(err);
  }
};


// ================= POSITIONS (OLD GENERIC) =================
const getPositions = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { type, client_code = null } = req.query;

    if (!type) {
      return sendError(
        res,
        'Query parameter "type" is required. Use: open, global, fo_global.',
        400
      );
    }

    const positions = await reportsService.getPositions(manager_id, type, client_code);

    return sendSuccess(
      res,
      { total: positions.length, positions },
      'Positions fetched successfully.'
    );
  } catch (err) {
    next(err);
  }
};


// ================= 🟢 OPEN POSITION =================
const getOpenPosition = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getOpenPosition(
      manager_id,
      req.query
    );

    return sendSuccess(
      res,
      data,
      'Open position report'
    );
  } catch (err) {
    next(err);
  }
};


// ================= 🔵 GLOBAL POSITION =================
const getGlobalPosition = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const { datefrm, dateTo } = req.query;

    if (!datefrm || !dateTo) {
      return sendError(res, 'datefrm and dateTo are required', 400);
    }

    const data = await reportsService.getGlobalPosition(
      manager_id,
      req.query
    );

    return sendSuccess(
      res,
      data,
      'Global position report'
    );
  } catch (err) {
    next(err);
  }
};


// ================= 🟣 FO GLOBAL POSITION =================
const getFoGlobalPosition = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const { datefrm, dateTo } = req.query;

    if (!datefrm || !dateTo) {
      return sendError(res, 'datefrm and dateTo are required', 400);
    }

    const data = await reportsService.getFoGlobalPosition(
      manager_id,
      req.query
    );

    return sendSuccess(
      res,
      data,
      'FO Global position report'
    );
  } catch (err) {
    next(err);
  }
};


// ================= TRIAL BALANCE =================
const getTrialBalance = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getTrialBalance(manager_id);

    return sendSuccess(
      res,
      data,
      'Trial Balance fetched successfully.'
    );
  } catch (err) {
    next(err);
  }
};


// ================= HOLDINGS REPORT (WITH PAGINATION) =================
const getHoldingsReport = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getHoldingsReport(
      manager_id,
      req.query
    );

    return sendSuccess(
      res,
      data,
      'Holdings report fetched successfully.'
    );
  } catch (err) {
    next(err);
  }
};


// ================= CLIENT MIS =================
const getClientMIS = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getClientMIS(manager_id);

    return sendSuccess(
      res,
      data,
      'Client MIS fetched successfully.'
    );
  } catch (err) {
    next(err);
  }
};


// ================= CAPITAL BROKERAGE =================
const getCapitalBrokerage = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getCapitalBrokerage(
      manager_id,
      req.query
    );

    return sendSuccess(res, data, "brokerage reports");
  } catch (err) {
    next(err);
  }
};


// ================= THIRD PARTY BROKERAGE =================
const getThirdPartyBrokerage = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getThirdPartyBrokerage(
      manager_id,
      req.query
    );

    return sendSuccess(res, data, "Details !!!");
  } catch (err) {
    next(err);
  }
};


// ================= RESEARCH BROKERAGE =================
const getResearchBrokerage = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getResearchBrokerage(
      manager_id,
      req.query
    );

    return sendSuccess(res, data, "Research report");
  } catch (err) {
    next(err);
  }
};


// ================= 🔵 SEND OTP =================
const sendOtp = async (req, res) => {
  try {
    const managerId = req.manager.manager_id;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[managerId] = {
      otp,
      verified: false
    };


    console.log("OTP for", managerId, ":", otp);

    return sendSuccess(res, { otp_sent: true }, "OTP sent");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};


// ================= 🟢 VERIFY OTP =================
const verifyOtp = async (req, res) => {
  try {
    const managerId = req.manager.manager_id;
    const { otp } = req.body;

    if (!otp) {
      return sendError(res, "OTP is required", 400);
    }

    const record = otpStore[managerId];

    if (!record || parseInt(otp) !== record.otp) {
      return sendError(res, "Invalid OTP", 400);
    }

    // ✅ VERIFIED
    otpStore[managerId].verified = true;

    return sendSuccess(res, { verified: true }, "OTP verified");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};


// ================= 📊 BROKERAGE SUMMARY =================
const getBrokerageSummary = async (req, res) => {
  try {
    const managerId = req.manager.manager_id;
    const otpFromHeader = req.headers['x-otp'];

    const data = await reportsService.getBrokerageSummary(
      managerId,
      req.query,
      otpFromHeader
    );

    return sendSuccess(res, data, "Brokerage Summary");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};


// ================= 📱 MOBILE LOGIN SUMMARY =================
const getMobileLoginSummary = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { datefrom, dateto } = req.query;

    if (!datefrom || !dateto) {
      return sendError(res, "datefrom and dateto are required", 400);
    }

    const data = await reportsService.getMobileLoginSummary({
      manager_id,
      datefrom,
      dateto,
    });

    return sendSuccess(res, data, "Mobile Login Summary");
  } catch (err) {
    next(err);
  }
};


// ================= 📱 MOBILE LOGIN REPORT =================
const getMobileLoginReport = async (req, res) => {
  try {
    const { datefrom, dateto, pageNumber = 0, size = 50 } = req.query;

    if (!datefrom || !dateto) {
      return sendError(res, "datefrom and dateto are required", 400);
    }

    const { manager_id } = req.manager;

    const from = moment(datefrom, "DD-MM-YYYY")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");

    const to = moment(dateto, "DD-MM-YYYY")
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");

    const [rows] = await sequelize.query(
      `SELECT 
        client_name,
        client_code,
        status,
        trade_status,
        last_traded_date,
        last_login_date
       FROM mobile_login_reports
       WHERE manager_id = :manager_id
       AND last_login_date BETWEEN :from AND :to
       ORDER BY last_login_date DESC
       LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          manager_id,
          from,
          to,
          limit: parseInt(size),
          offset: parseInt(pageNumber * size),
        },
      }
    );

    return sendSuccess(
      res,
      {
        clientlist: rows,
      },
      rows.length ? "Data fetched successfully" : "No data found"
    );
  } catch (err) {
    return sendError(res, err.message || "Internal server error", 500);
  }
};
// ================= 📊 BRANCH PERFORMANCE =================
const getBranchPerformance = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { datefrom, dateto } = req.query;

    if (!datefrom || !dateto) {
      return sendError(res, "datefrom and dateto are required", 400);
    }

    const data = await reportsService.getBranchPerformance(
      manager_id,
      req.query
    );

    return sendSuccess(
      res,
      data,
      "Branch Performance fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};
// ================= REACTIVATION REPORT =================
const getReactivationReport = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getReactivationReport(
      manager_id,
      req.query   // 🔥 CHANGE
    );

    return res.json(data);
  } catch (err) {
    next(err);
  }
};
// ================= SAM PARK REPORT =================
const getSamparkReport = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getSamparkReport(
      manager_id,
      req.query   // 🔥 CHANGE
    );

    return res.json(data);
  } catch (err) {
    next(err);
  }
};
// ================= 📊 KRA STATUS =================
const getKRA = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getKRA(manager_id, req.query);

    return sendSuccess(res, data, "KRA Status");
  } catch (err) {
    next(err);
  }
};


// ================= 📊 HOLD KRA =================
const getHoldKRA = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getHoldKRA(manager_id, req.query);

    return sendSuccess(res, data, "Hold KRA Status");
  } catch (err) {
    next(err);
  }
};


// ================= 📊 MODIFICATION =================
const getModification = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getModification(manager_id, req.query);

    return sendSuccess(res, data, "Modification Report");
  } catch (err) {
    next(err);
  }
};


// ================= 📊 PHYSICAL ACCOUNT =================
const getPhysical = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;

    const data = await reportsService.getPhysical(manager_id, req.query);

    return sendSuccess(res, data, "Physical Account Report");
  } catch (err) {
    next(err);
  }
};
// ================= 📊 NOMINEE PENDING =================
const getNomineePending = async (req, res, next) => {
  try {
    const data = await reportsService.getNomineePending(req.query);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};
// ================= COMPLIANCE CIRCULAR =================
const getComplianceCircular = async (req, res, next) => {
  try {
    const data = await reportsService.getComplianceCircular(req.query);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};


// ================= MARKETING MATERIAL =================
const getMarketingMaterial = async (req, res, next) => {
  try {
    const data = await reportsService.getMarketingMaterial(req.query);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};


// ================= DOWNLOAD FILES =================
const getDownloadFiles = async (req, res, next) => {
  try {
    const data = await reportsService.getDownloadFiles();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};


// ================= CERTIFICATES =================
const getCertificates = async (req, res, next) => {
  try {
    const data = await reportsService.getCertificates();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};
// ================= 📤 UPLOAD CERTIFICATE =================
const uploadCertificate = async (req, res, next) => {
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : req.file;

    const data = await reportsService.uploadCertificate(file);

    return sendSuccess(
      res,
      data,
      "Certificate uploaded successfully"
    );
  } catch (err) {
    next(err);
  }
};
// ================= 📤 UPLOAD CERTIFICATE =================
const getMtfBalance = async (req, res) => {
  try {
    const data = await reportsService.getMtfBalance(req.query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================= 📊 MTF REPORT =================
const getMTFReport = async (req, res, next) => {
  try {
    const data = await reportsService.getMTFReport(req.query);

    return res.json(data);
  } catch (err) {
    next(err);
  }
};

// ================= 📊 IPO REPORT =================
const getIPOReport = async (req, res, next) => {
  try {
    const data = await reportsService.getIPOReport(req.query);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

// ================= 📄 DP SLIP =================
const getDPSlip = async (req, res, next) => {
  try {
    const data = await reportsService.getDPSlip(req.query);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

// ================= 📈 RESEARCH CALL =================
const getResearchCallDisplay = async (req, res, next) => {
  try {
    const { SearchType } = req.query;

    if (!SearchType) {
      return res.status(400).json({
        success: false,
        message: "SearchType is required"
      });
    }

    const data = await reportsService.getResearchCalls(SearchType);

    return res.json(data);
  } catch (err) {
    next(err);
  }
};

// ================= 📈 ALGO BROKERAGE =================
const getAlgoBrokerage = async (req, res, next) => {
  try {
    const { datefrom, dateto, pageNumber, size } = req.query;

    if (!datefrom || !dateto) {
      return res.status(400).json({
        success: false,
        message: "datefrom and dateto are required",
      });
    }

    const data = await reportsService.getAlgoBrokerage({
      datefrom,
      dateto,
      pageNumber,
      size
    });

    return res.json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};

// ================= 📈 MUTUAL FUND =================
const getMutualFundReport = async (req, res, next) => {
  try {
    const data = await reportsService.getMutualFundReport(req.query);

    return sendSuccess(
      res,
      data,
      data.all_Count ? "Data fetched successfully" : "Data not found !!!"
    );
  } catch (err) {
    next(err);
  }
};

// ================= MF REJECTION =================
const getMfRejectionReport = async (req, res, next) => {
  try {
    const data = await reportsService.getMfRejectionReport(req.query);

    return sendSuccess(
      res,
      data,
      data.MfRejection.length ? "Data fetched successfully" : "Data not found !!!"
    );
  } catch (err) {
    next(err);
  }
};

// ================= MF MANDATE REPORT =================
const getMfMandateReport = async (req, res, next) => {
  try {
    const data = await reportsService.getMfMandateReport(req.query);

    return sendSuccess(
      res,
      data,
      data.MfMandate ? "Data fetched successfully" : "Data not found !!!"
    );
  } catch (err) {
    next(err);
  }
};

// ================= BOND OFFER =================
const getBondOffers = async (req, res, next) => {
  try {
    const data = await reportsService.getBondOffers();

    return sendSuccess(
      res,
      data,
      "Details !!"
    );
  } catch (err) {
    next(err);
  }
};

// ================= 📊 CONTEST DATA =================
const getContestData = async (req, res, next) => {
  try {
    const data = await reportsService.getContestData(req.query);

    return sendSuccess(
      res,
      data,
      data.list.length ? "Client Details" : "Data not found !!!"
    );
  } catch (err) {
    next(err);
  }
};

// ================= INACTIVE CLIENTS =================
const getInactiveClients = async (req, res, next) => {
  try {
    const data = await reportsService.getInactiveClients(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ================= 📝 FOLLOW UP DATA =================
const getFollowUpData = async (req, res, next) => {
  try {
    const data = await reportsService.getFollowUpData(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ================= 💰 CLIENT BALANCE (PAYOUT) =================
const getClientBalance = async (req, res, next) => {
  try {
    const data = await reportsService.getClientBalance(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBondOffers,
  getMfMandateReport,
  getMfRejectionReport,
  getMutualFundReport,
  getAlgoBrokerage,
  getResearchCallDisplay,
  getDPSlip,
  getIPOReport,
  getHoldings,
  getHoldingsReport,
  getPositions,
  getOpenPosition,
  getGlobalPosition,
  getFoGlobalPosition,
  getTrialBalance,
  getClientMIS,
  getCapitalBrokerage,
  getThirdPartyBrokerage,
  getResearchBrokerage,
  sendOtp,
  verifyOtp,
  getBrokerageSummary,
  getMobileLoginSummary,
  getMobileLoginReport,
  getBranchPerformance,
  getReactivationReport,
  getSamparkReport,
  getKRA,
  getHoldKRA,
  getModification,
  getPhysical,
  getNomineePending,
  getComplianceCircular,
  getMarketingMaterial,
  getDownloadFiles,
  getCertificates,
  uploadCertificate,
  getMtfBalance,
  getMTFReport,
  getContestData,
  getInactiveClients,
  getFollowUpData,
  getClientBalance

};