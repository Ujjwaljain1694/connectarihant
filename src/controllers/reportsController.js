const reportsService = require('../services/reportsService');
const { sendSuccess, sendError } = require('../utils/responseHelper');


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


module.exports = {
  getHoldings,
  getHoldingsReport,   // ✅ NEW
  getPositions,        // old
  getOpenPosition,
  getGlobalPosition,
  getFoGlobalPosition,
  getTrialBalance,
  getClientMIS,
};