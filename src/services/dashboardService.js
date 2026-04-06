const { Client } = require('../models');
const { Op } = require('sequelize');

/**
 * Get aggregated dashboard stats for a manager
 */
const getDashboardStats = async (manager_id) => {
  const [totalClients, activeClients, newClients, inactiveClients, appLoginResult] = await Promise.all([
    Client.count({ where: { manager_id } }),
    Client.count({ where: { manager_id, status: 'Active' } }),
    Client.count({ where: { manager_id, status: 'New' } }),
    Client.count({ where: { manager_id, status: 'Inactive' } }),
    Client.sum('app_login_count', { where: { manager_id } }),
  ]);

  return {
    totalClients,
    activeClients,
    newClients,
    inactiveClients,
    totalAppLogin: appLoginResult || 0,
  };
};

module.exports = { getDashboardStats };
