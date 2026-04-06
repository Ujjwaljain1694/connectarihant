const reportsService = require('../services/reportsService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getHoldings = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { client_code = null, date = null } = req.query;
    const holdings = await reportsService.getHoldings(manager_id, client_code, date);
    return sendSuccess(res, { total: holdings.length, holdings }, 'Holdings fetched successfully.');
  } catch (err) {
    next(err);
  }
};

const getPositions = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { type, client_code = null } = req.query;

    if (!type) {
      return sendError(res, 'Query parameter "type" is required. Use: open, global, fo_global.', 400);
    }

    const positions = await reportsService.getPositions(manager_id, type, client_code);
    return sendSuccess(res, { total: positions.length, positions }, 'Positions fetched successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getHoldings, getPositions };
