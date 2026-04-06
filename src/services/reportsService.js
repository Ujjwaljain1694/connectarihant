const { Holding, Position, Client } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all holdings for a manager's clients, optionally filtered by client_code
 */
const getHoldings = async (manager_id, client_code = null, date = null) => {
  // First, get all client_codes belonging to this manager
  const clientWhere = { manager_id };
  if (client_code) clientWhere.client_code = client_code;

  const clients = await Client.findAll({
    where: clientWhere,
    attributes: ['client_code', 'client_name'],
  });

  if (!clients.length) return [];

  const clientCodeMap = {};
  clients.forEach((c) => { clientCodeMap[c.client_code] = c.client_name; });
  const clientCodes = Object.keys(clientCodeMap);

  const holdingWhere = { client_code: { [Op.in]: clientCodes } };
  if (date) holdingWhere.date = date;

  const holdings = await Holding.findAll({
    where: holdingWhere,
    order: [['client_code', 'ASC'], ['script_name', 'ASC']],
  });

  return holdings.map((h) => ({
    clientName: clientCodeMap[h.client_code] || h.client_code,
    clientCode: h.client_code,
    scriptCode: h.script_code,
    scriptName: h.script_name,
    isin: h.isin,
    pledgePOA: parseFloat(h.pledge_poa),
    freePOA: parseFloat(h.free_poa),
    mtfQty: parseFloat(h.mtf_qty),
    netQty: parseFloat(h.net_qty),
    stockValue: parseFloat(h.stock_value),
    closeRate: parseFloat(h.close_rate),
    date: h.date,
  }));
};

/**
 * Get positions for a manager's clients
 * @param {string} manager_id
 * @param {string} type - 'open' | 'global' | 'fo_global'
 * @param {string|null} client_code
 */
const getPositions = async (manager_id, type, client_code = null) => {
  const typeMap = {
    open: 'Open',
    global: 'Global',
    fo_global: 'FO_Global',
  };

  const mappedType = typeMap[type?.toLowerCase()];
  if (!mappedType) {
    throw { status: 400, message: 'Invalid position type. Use: open, global, or fo_global.' };
  }

  const clientWhere = { manager_id };
  if (client_code) clientWhere.client_code = client_code;

  const clients = await Client.findAll({
    where: clientWhere,
    attributes: ['client_code', 'client_name'],
  });

  if (!clients.length) return [];

  const clientCodeMap = {};
  clients.forEach((c) => { clientCodeMap[c.client_code] = c.client_name; });
  const clientCodes = Object.keys(clientCodeMap);

  const positions = await Position.findAll({
    where: {
      client_code: { [Op.in]: clientCodes },
      position_type: mappedType,
    },
    order: [['client_code', 'ASC'], ['script_name', 'ASC']],
  });

  return positions.map((p) => ({
    clientName: clientCodeMap[p.client_code] || p.client_code,
    clientCode: p.client_code,
    positionType: p.position_type,
    scriptName: p.script_name,
    scriptCode: p.script_code,
    exchange: p.exchange,
    product: p.product,
    buyQty: parseFloat(p.buy_qty),
    sellQty: parseFloat(p.sell_qty),
    netQty: parseFloat(p.net_qty),
    buyAvg: parseFloat(p.buy_avg),
    sellAvg: parseFloat(p.sell_avg),
    ltp: parseFloat(p.ltp),
    value: parseFloat(p.value),
    pnl: parseFloat(p.pnl),
    date: p.date,
  }));
};

module.exports = { getHoldings, getPositions };
