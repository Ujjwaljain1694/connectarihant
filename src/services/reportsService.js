const { Holding, Position, Client, TrialBalance, Brokerage, ThirdParty, Research } = require('../models');
const { Op } = require('sequelize');
const convertDate = require("../utils/formatDate"); // ✅ NEW


/**
 * ================= HOLDINGS =================
 */
const getHoldings = async (manager_id, client_code = null, date = null) => {

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
 * ================= HOLDINGS REPORT (WITH PAGINATION) =================
 */
const getHoldingsReport = async (manager_id, query) => {
  const {
    datefrom,
    Search,
    SearchType,
    size = 50,
    pageNumber = 0,
  } = query;

  if (!datefrom) {
    throw new Error("datefrom is required");
  }

  // ✅ convert date
  const formattedDate = convertDate(datefrom);

  // Step 1: get manager clients
  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ["client_code"],
  });

  let clientCodes = clients.map(c => c.client_code);

  // ✅ search filter (like Clientcode)
  if (SearchType === "Clientcode" && Search) {
    clientCodes = [Search];
  }

  // Step 2: where condition
  const where = {
    client_code: {
      [Op.in]: clientCodes,
    },
    date: formattedDate,
  };

  // Step 3: pagination
  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await Holding.findAndCountAll({
    where,
    limit,
    offset,
  });

  // ✅ total stock value
  const totalValue = rows.reduce(
    (sum, item) => sum + parseFloat(item.stock_value || 0),
    0
  );

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    TotalStockValue: totalValue.toFixed(2),
    result1: rows,
  };
};


/**
 * ================= OPEN POSITION =================
 * ❌ NO DATE FILTER
 */
const getOpenPosition = async (manager_id, query) => {

  const { Search, SearchType, size = 50, pageNumber = 0 } = query;

  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ['client_code', 'client_name'],
  });

  if (!clients.length) return [];

  const clientCodeMap = {};
  clients.forEach(c => clientCodeMap[c.client_code] = c.client_name);

  let clientCodes = Object.keys(clientCodeMap);

  if (SearchType === "Clientcode" && Search) {
    clientCodes = [Search];
  }

  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await Position.findAndCountAll({
    where: {
      client_code: { [Op.in]: clientCodes },
      position_type: "Open",
    },
    limit,
    offset,
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    userList: rows.map(p => ({
      clientName: clientCodeMap[p.client_code] || p.client_code,
      clientCode: p.client_code,
      scriptName: p.script_name,
      exchange: p.exchange,
      buyQty: parseFloat(p.buy_qty),
      sellQty: parseFloat(p.sell_qty),
      netQty: parseFloat(p.net_qty),
      pnl: parseFloat(p.pnl),
      date: p.date,
    }))
  };
};


/**
 * ================= GLOBAL POSITION =================
 * ✅ DATE RANGE REQUIRED
 */
const getGlobalPosition = async (manager_id, query) => {

  const { datefrm, dateTo, Search, SearchType, size = 50, pageNumber = 0 } = query;

  if (!datefrm || !dateTo) {
    throw { status: 400, message: "datefrm and dateTo are required" };
  }

  const fromDate = convertDate(datefrm);
  const toDate = convertDate(dateTo);

  if (new Date(fromDate) > new Date(toDate)) {
    throw { status: 400, message: "datefrm cannot be greater than dateTo" };
  }

  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ['client_code', 'client_name'],
  });

  if (!clients.length) return [];

  const clientCodeMap = {};
  clients.forEach(c => clientCodeMap[c.client_code] = c.client_name);

  let clientCodes = Object.keys(clientCodeMap);

  if (SearchType === "Clientcode" && Search) {
    clientCodes = [Search];
  }

  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await Position.findAndCountAll({
    where: {
      client_code: { [Op.in]: clientCodes },
      position_type: "Global",
      date: {
        [Op.between]: [fromDate, toDate],
      },
    },
    limit,
    offset,
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    result1: rows,
  };
};


/**
 * ================= FO GLOBAL POSITION =================
 * ✅ DATE RANGE REQUIRED
 */
const getFoGlobalPosition = async (manager_id, query) => {

  const { datefrm, dateTo, Search, SearchType, size = 50, pageNumber = 0 } = query;

  if (!datefrm || !dateTo) {
    throw { status: 400, message: "datefrm and dateTo are required" };
  }

  const fromDate = convertDate(datefrm);
  const toDate = convertDate(dateTo);

  if (new Date(fromDate) > new Date(toDate)) {
    throw { status: 400, message: "datefrm cannot be greater than dateTo" };
  }

  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ['client_code', 'client_name'],
  });

  if (!clients.length) return [];

  const clientCodeMap = {};
  clients.forEach(c => clientCodeMap[c.client_code] = c.client_name);

  let clientCodes = Object.keys(clientCodeMap);

  if (SearchType === "Clientcode" && Search) {
    clientCodes = [Search];
  }

  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await Position.findAndCountAll({
    where: {
      client_code: { [Op.in]: clientCodes },
      position_type: "FO_Global",
      date: {
        [Op.between]: [fromDate, toDate],
      },
    },
    limit,
    offset,
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    result1: rows,
  };
};


/**
 * ================= TRIAL BALANCE =================
 */
const getTrialBalance = async (manager_id) => {
  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ['client_code', 'client_name']
  });

  if (!clients.length) return [];

  const clientCodes = clients.map(c => c.client_code);

  const trialData = await TrialBalance.findAll({
    where: {
      client_code: { [Op.in]: clientCodes }
    }
  });

  return clients.map(client => {
    const tb = trialData.find(t => t.client_code === client.client_code);

    return {
      clientName: client.client_name,
      clientCode: client.client_code,
      openDebit: tb ? parseFloat(tb.open_debit || 0) : 0,
      openCredit: tb ? parseFloat(tb.open_credit || 0) : 0,
      netDebit: tb ? parseFloat(tb.net_debit || 0) : 0,
      netCredit: tb ? parseFloat(tb.net_credit || 0) : 0,
    };
  });
};


/**
 * ================= CLIENT MIS =================
 */
const getClientMIS = async (manager_id) => {
  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ['client_code', 'client_name', 'pan', 'mobile', 'email']
  });

  if (!clients.length) return [];

  return clients.map(client => ({
    clientCode: client.client_code,
    clientName: client.client_name,
    pan: client.pan || 'N/A',
    mobile: client.mobile || 'N/A',
    email: client.email || 'N/A'
  }));
};


/**
 * ================= CAPITAL BROKERAGE =================
 */
const getCapitalBrokerage = async (manager_id, query) => {
  const {
    datefrom,
    dateTo,
    Search,
    SearchType,
    size = 50,
    pageNumber = 0,
  } = query;

  if (!datefrom || !dateTo) {
    throw { status: 400, message: "datefrom and dateTo are required" };
  }

  const clients = await Client.findAll({
    where: { manager_id },
    attributes: ["client_code", "client_name"],
  });

  let clientCodes = clients.map(c => c.client_code);

  if (SearchType === "Clientcode" && Search) {
    clientCodes = [Search];
  }

  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await Brokerage.findAndCountAll({
    where: {
      client_code: { [Op.in]: clientCodes },
      type: "CAPITAL",
      date: {
        [Op.between]: [convertDate(datefrom), convertDate(dateTo)],
      },
    },
    limit,
    offset,
  });

  let totalTurnover = 0;
  let totalBrokerage = 0;

  rows.forEach(r => {
    totalTurnover += parseFloat(r.turnover || 0);
    totalBrokerage += parseFloat(r.brokerage || 0);
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    totalTurnover,
    totalBrokerage,
    userList: rows,
  };
};


/**
 * ================= THIRD PARTY BROKERAGE =================
 */
const getThirdPartyBrokerage = async (manager_id, query) => {
  const { fromDate, ToDate, size = 50, pageNumber = 0 } = query;

  if (!fromDate || !ToDate) {
    throw { status: 400, message: "fromDate and ToDate are required" };
  }

  const convertDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const from = convertDate(fromDate);
  const to = convertDate(ToDate);

  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await ThirdParty.findAndCountAll({
    where: {
      manager_id,
      date: {
        [Op.between]: [
          new Date(`${from} 00:00:00`),
          new Date(`${to} 23:59:59`)
        ]
      }
    },
    limit,
    offset,
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    resultlist: rows,
  };
};


/**
 * ================= RESEARCH BROKERAGE =================
 */
const getResearchBrokerage = async (manager_id, query) => {
  const { TradeDate, size = 50, pageNumber = 0 } = query;

  if (!TradeDate) {
    throw { status: 400, message: "TradeDate is required" };
  }

  const limit = parseInt(size);
  const offset = pageNumber * limit;

  const { count, rows } = await Research.findAndCountAll({
    where: {
      manager_id,
      date: convertDate(TradeDate),
    },
    limit,
    offset,
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / limit),
    rowsPerPage: limit,
    resultlist: rows,
  };
};


/**
 * ================= EXPORT =================
 */
module.exports = {
  getHoldings,
  getHoldingsReport,
  getOpenPosition,
  getGlobalPosition,
  getFoGlobalPosition,
  getTrialBalance,
  getClientMIS,
  getCapitalBrokerage,
  getThirdPartyBrokerage,
  getResearchBrokerage,
};