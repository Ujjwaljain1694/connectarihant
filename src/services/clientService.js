const { Client } = require('../models');
const { maskPAN, maskMobile, maskEmail } = require('../utils/maskHelper');

/**
 * Get clients for a manager with optional status filter
 * @param {string} manager_id
 * @param {string} status - 'active' | 'inactive' | 'new' | 'all'
 */
const getClients = async (manager_id, status = 'all') => {
  const where = { manager_id };

  if (status && status.toLowerCase() !== 'all') {
    const statusMap = {
      active: 'Active',
      inactive: 'Inactive',
      new: 'New',
    };
    const mappedStatus = statusMap[status.toLowerCase()];
    if (!mappedStatus) {
      throw { status: 400, message: 'Invalid status filter. Use: active, inactive, new, or all.' };
    }
    where.status = mappedStatus;
  }

  const clients = await Client.findAll({
    where,
    attributes: ['client_code', 'client_name', 'pan', 'mobile', 'email', 'status', 'app_login_count'],
    order: [['client_name', 'ASC']],
  });

  return clients.map((c) => ({
    clientCode: c.client_code,
    clientName: c.client_name,
    pan: maskPAN(c.pan),
    mobile: maskMobile(c.mobile),
    email: maskEmail(c.email),
    status: c.status,
    appLoginCount: c.app_login_count,
  }));
};

module.exports = { getClients };
