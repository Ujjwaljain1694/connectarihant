const clientService = require('../services/clientService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getClients = async (req, res, next) => {
  try {
    const { manager_id } = req.manager;
    const { status = 'all' } = req.query;
    const clients = await clientService.getClients(manager_id, status);
    return sendSuccess(res, { total: clients.length, clients }, 'Clients fetched successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getClients };
