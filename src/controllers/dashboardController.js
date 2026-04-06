const dashboardService = require('../services/dashboardService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getStats = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const stats = await dashboardService.getDashboardStats(manager_id);
    return sendSuccess(res, stats, 'Dashboard stats fetched successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
