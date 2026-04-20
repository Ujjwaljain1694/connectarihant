const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const reportController = require('../controllers/reportsController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * ================= HOLDINGS =================
 * GET /api/reports/holdings?client_code=&date=
 */
router.get('/holdings', authenticate, reportController.getHoldings);


/**
 * ================= HOLDINGS REPORT (WITH PAGINATION) =================
 * GET /api/reports/holdings-report?datefrom=DD/MM/YYYY&Search=&SearchType=Clientcode&size=50&pageNumber=0
 */
router.get('/holdings-report', authenticate, reportController.getHoldingsReport);


/**
 * ================= POSITIONS (OLD GENERIC) =================
 * GET /api/reports/positions?type=open|global|fo_global&client_code=
 */
router.get('/positions', authenticate, reportController.getPositions);


/**
 * ================= 🟢 OPEN POSITION =================
 * GET /api/reports/positions/open
 */
router.get('/positions/open', authenticate, reportController.getOpenPosition);


/**
 * ================= 🔵 GLOBAL POSITION =================
 * GET /api/reports/positions/global?datefrm=&dateTo=
 */
router.get('/positions/global', authenticate, reportController.getGlobalPosition);


/**
 * ================= 🟣 FO GLOBAL POSITION =================
 * GET /api/reports/positions/fo-global?datefrm=&dateTo=
 */
router.get('/positions/fo-global', authenticate, reportController.getFoGlobalPosition);


/**
 * ================= TRIAL BALANCE =================
 * GET /api/reports/trial-balance
 */
router.get('/trial-balance', authenticate, reportController.getTrialBalance);


/**
 * ================= CLIENT MIS =================
 * GET /api/reports/client-mis
 */
router.get('/client-mis', authenticate, reportController.getClientMIS);


/**
 * ================= CAPITAL BROKERAGE =================
 * GET /api/reports/brokerage/capital?datefrom=&dateTo=&Search=&SearchType=Clientcode&size=50&pageNumber=0
 */
router.get('/brokerage/capital', authenticate, reportController.getCapitalBrokerage);


/**
 * ================= THIRD PARTY BROKERAGE =================
 * GET /api/reports/brokerage/third-party?fromDate=&ToDate=&size=50&pageNumber=0
 */
router.get('/brokerage/third-party', authenticate, reportController.getThirdPartyBrokerage);


/**
 * ================= RESEARCH BROKERAGE =================
 * GET /api/reports/brokerage/research?TradeDate=&size=50&pageNumber=0
 */
router.get('/brokerage/research', authenticate, reportController.getResearchBrokerage);


/**
 * ================= 🔵 SEND OTP =================
 * POST /api/reports/brokerage/send-otp
 */
router.post('/brokerage/send-otp', authenticate, reportController.sendOtp);


/**
 * ================= 🟢 VERIFY OTP =================
 * POST /api/reports/brokerage/verify-otp
 * Body: { "otp": "123456" }
 */
router.post('/brokerage/verify-otp', authenticate, reportController.verifyOtp);


/**
 * ================= 📊 BROKERAGE SUMMARY =================
 * GET /api/reports/brokerage/summary?datefrom=DD-MM-YYYY&dateTo=DD-MM-YYYY
 * Header: x-otp: <manager_otp_from_verify>
 */
router.get(
  '/brokerage/summary',
  authenticate,
  reportController.getBrokerageSummary
);


/**
 * ================= 📱 MOBILE LOGIN SUMMARY =================
 * GET /api/reports/mobile-login-summary?datefrom=DD-MM-YYYY&dateto=DD-MM-YYYY
 */
router.get(
  '/mobile-login-summary',
  authenticate,
  reportController.getMobileLoginSummary
);


/**
 * ================= 📱 MOBILE LOGIN REPORT =================
 * GET /api/reports/mobile-login-report?datefrom=DD-MM-YYYY&dateto=DD-MM-YYYY&pageNumber=0&size=50
 */
router.get(
  '/mobile-login-report',
  authenticate,
  reportController.getMobileLoginReport
);
// ================= 📊 BRANCH PERFORMANCE =================
// GET /api/reports/branch-performance?datefrom=DD-MM-YYYY&dateto=DD-MM-YYYY
router.get(
  '/branch-performance',
  authenticate,
  reportController.getBranchPerformance
);
// ================= 📊 REACTIVATION REPORT =================
router.get(
  '/reactivation-report',
  authenticate,
  reportController.getReactivationReport
);
// ================= 📊 SAMPARK REPORT =================
router.get(
  '/sampark-report',
  authenticate,
  reportController.getSamparkReport
);

// ================= 📊 KRA STATUS =================
router.get(
  '/kra-status',
  authenticate,
  reportController.getKRA
);

// ================= 📊 HOLD KRA =================
router.get(
  '/hold-kra',
  authenticate,
  reportController.getHoldKRA
);

// ================= 📊 MODIFICATION =================
router.get(
  '/modification',
  authenticate,
  reportController.getModification
);

// ================= 📊 PHYSICAL ACCOUNT =================
router.get(
  '/physical-account',
  authenticate,
  reportController.getPhysical
);

// ================= 📊 REACTIVATION =================
router.get(
  '/reactivation-report',
  authenticate,
  reportController.getReactivationReport
);

// ================= 📊 SAMPARK =================
router.get(
  '/sampark-report',
  authenticate,
  reportController.getSamparkReport
);
// ================= 📊 NOMINEE PENDING =================
router.get(
  '/nominee-pending',
  authenticate,
  reportController.getNomineePending
);

// ================= 📊 COMPLIANCE CIRCULAR =================
router.get(
  '/compliance-circular',
  authenticate,
  reportController.getComplianceCircular
);

// ================= 📊 MARKETING MATERIAL =================
router.get(
  '/marketing-material',
  authenticate,
  reportController.getMarketingMaterial
);

// ================= 📊 DOWNLOAD FILES =================
router.get(
  '/download-files',
  authenticate,   // 🔐 token required
  reportController.getDownloadFiles
);

// ================= 📊 CERTIFICATES =================
router.get(
  '/certificate',
  authenticate,
  reportController.getCertificates
);
// ================= 📤 UPLOAD CERTIFICATE =================
router.post(
  '/upload-certificate',
  authenticate,
  upload.any(), // Changed from upload.single('file') to bypass field name mismatch
  reportController.uploadCertificate
);
// ================= 📊 MTF BALANCE =================
router.get(
  '/mtf-balance',
  authenticate,
  reportController.getMtfBalance
);

// ================= 📊 MTF REPORT =================
router.get(
  '/mtf-report',
  authenticate,
  reportController.getMTFReport
);

// ================= 📊 IPO REPORT =================
router.get(
  '/ipo-report',
  authenticate,
  reportController.getIPOReport
);

// ================= 📄 DP SLIP (GET) =================
router.get(
  '/dp-slip',
  authenticate,
  reportController.getDPSlip
);

// ================= 📈 RESEARCH CALL =================
router.get(
  '/research-call',
  authenticate,
  reportController.getResearchCallDisplay
);

// ================= 📈 ALGO BROKERAGE =================
router.get(
  '/algo-brokerage',
  authenticate,
  reportController.getAlgoBrokerage
);

// ================= 📈 MUTUAL FUND REPORT =================
router.get(
  '/mutual-fund-report',
  authenticate,
  reportController.getMutualFundReport
);

// ================= ❌ MF REJECTION =================
router.get(
  '/mf-rejection-report',
  authenticate,
  reportController.getMfRejectionReport
);

// ================= 📋 MF MANDATE REPORT =================
router.get(
  '/mf-mandate-report',
  authenticate,
  reportController.getMfMandateReport
);

// ================= 📈 BOND OFFER =================
router.post(
  '/bond-offer',
  authenticate,
  reportController.getBondOffers
);

// ================= 📊 CONTEST DATA =================
router.get(
  '/contest-data',
  authenticate,
  reportController.getContestData
);

// ================= 🚪 INACTIVE CLIENTS =================
router.get(
  "/inactive-clients",
  authenticate,
  reportController.getInactiveClients
);

// ================= 📝 FOLLOW UP REPORT =================
router.get(
  "/followup-report",
  authenticate, // Bearer token
  reportController.getFollowUpData
);

module.exports = router;