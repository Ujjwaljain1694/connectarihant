const express = require('express');
const router = express.Router();

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


module.exports = router;