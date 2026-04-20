const { Holding, Position, Client, TrialBalance, Brokerage, ThirdParty, Research, BranchPerformance, ReactivationReport,
  SamparkReport, KRAStatus, HoldKRA, Modification, PhysicalAccount, NomineePending, ComplianceCircular, MarketingMaterial, DownloadFile, Certificate, UploadCertificate, MtfBalance } = require('../models');
const { Op } = require('sequelize');
const convertDate = require("../utils/formatDate"); // ✅ NEW
const otpStore = require("../utils/otpStore"); // ✅ OTP Store


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
 * ================= BROKERAGE SUMMARY =================
 */
const getBrokerageSummary = async (managerId, query, otpFromHeader) => {
  const { datefrom, dateTo } = query;

  if (!datefrom || !dateTo) {
    throw new Error("datefrom and dateTo are required");
  }

  // ✅ Check OTP Verification
  const record = otpStore[managerId];

  console.log("HEADER OTP:", otpFromHeader);
  console.log("STORED OTP:", record?.otp);
  console.log("VERIFIED:", record?.verified);

  // If OTP not valid, return masked data
  if (
    !record ||
    !record.verified ||
    !otpFromHeader ||
    parseInt(otpFromHeader) !== record.otp
  ) {
    return {
      totalBrokerage: "XXXX",
      totalCapBrokerage: "XXXX",
      totalCommBrokerage: "XXXX",
      totalFnoBrokerage: "XXXX",
      totalCapTurnover: "XXXX",
      totalFnoTurnover: "XXXX",
      totalTurnover: "XXXX",
      totalCommTurnover: "XXXX"
    };
  }

  const from = convertDate(datefrom);
  const to = convertDate(dateTo);

  const data = await Brokerage.findAll({
    where: {
      date: {
        [Op.between]: [
          new Date(`${from} 00:00:00`),
          new Date(`${to} 23:59:59`)
        ]
      }
    }
  });

  let totalBrokerage = 0;
  let totalTurnover = 0;

  let capBrokerage = 0;
  let fnoBrokerage = 0;
  let commBrokerage = 0;

  let capTurnover = 0;
  let fnoTurnover = 0;
  let commTurnover = 0;

  data.forEach(d => {
    const brokerage = parseFloat(d.brokerage || 0);
    const turnover = parseFloat(d.turnover || 0);

    totalBrokerage += brokerage;
    totalTurnover += turnover;

    if (d.type === 'CAPITAL') {
      capBrokerage += brokerage;
      capTurnover += turnover;
    }

    if (d.type === 'FNO') {
      fnoBrokerage += brokerage;
      fnoTurnover += turnover;
    }

    if (d.type === 'COMMODITY') {
      commBrokerage += brokerage;
      commTurnover += turnover;
    }
  });

  // ✅ Return real data after OTP verified
  return {
    totalBrokerage,
    totalCapBrokerage: capBrokerage,
    totalCommBrokerage: commBrokerage,
    totalFnoBrokerage: fnoBrokerage,
    totalCapTurnover: capTurnover,
    totalFnoTurnover: fnoTurnover,
    totalTurnover,
    totalCommTurnover: commTurnover
  };
};


/**
 * ================= HELPER FUNCTIONS =================
 */
function convertDateHelper(dateStr) {
  if (!dateStr) return null;
  const [dd, mm, yyyy] = dateStr.split("-");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

function formatDateHelper(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}


/**
 * ================= MOBILE LOGIN SUMMARY =================
 */
const getMobileLoginSummary = async ({ manager_id, datefrom, dateto }) => {
  if (!datefrom || !dateto) {
    throw new Error("datefrom and dateto are required");
  }

  const from = convertDateHelper(datefrom);
  const to = new Date(convertDateHelper(dateto));
  to.setHours(23, 59, 59, 999);

  const TotalActiveClients = await Client.count({
    where: { manager_id, status: "Active" },
  });

  const TotalLoginClients = await Client.count({
    where: {
      manager_id,
      app_login_count: { [Op.gt]: 0 },
      updatedAt: { [Op.between]: [from, to] },
    },
  });

  const TotalTradedClients = await Client.count({
    where: {
      manager_id,
      app_login_count: { [Op.gt]: 0 },
      updatedAt: { [Op.between]: [from, to] },
    },
  });

  const TotalNonTradedClients = await Client.count({
    where: {
      manager_id,
      app_login_count: 0,
      updatedAt: { [Op.between]: [from, to] },
    },
  });

  return {
    TotalActiveClients,
    TotalLoginClients,
    TotalTradedClients,
    TotalNonTradedClients,
  };
};


/**
 * ================= MOBILE LOGIN REPORT =================
 */
const getMobileLoginReport = async ({
  manager_id,
  pageNumber = 0,
  size = 50,
  datefrom,
  dateto,
}) => {
  if (!datefrom || !dateto) {
    throw new Error("datefrom and dateto are required");
  }

  const offset = pageNumber * size;
  const from = convertDateHelper(datefrom);
  const to = new Date(convertDateHelper(dateto));
  to.setHours(23, 59, 59, 999);

  const { count, rows } = await Client.findAndCountAll({
    where: {
      manager_id,
      updatedAt: {
        [Op.between]: [from, to],
      },
    },
    limit: parseInt(size),
    offset: parseInt(offset),
    order: [["updatedAt", "DESC"]],
  });

  const totalActive = await Client.count({
    where: { manager_id, status: "Active" },
  });

  const totalLogin = await Client.count({
    where: {
      manager_id,
      app_login_count: { [Op.gt]: 0 },
    },
  });

  const totalTraded = totalLogin;

  const totalNonTraded = await Client.count({
    where: {
      manager_id,
      app_login_count: 0,
    },
  });

  const clientlist = rows.map((client) => ({
    client_name: client.client_name,
    client_code: client.client_code,
    status: client.status,
    trade_status: client.app_login_count > 0 ? "YES" : "NO",
    last_login_date: formatDateHelper(client.updatedAt),
    last_traded_date: formatDateHelper(client.updatedAt),
  }));

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / size),
    rowsPerPage: parseInt(size),
    TotalActiveClients: totalActive,
    TotalLoginClients: totalLogin,
    TotalTradedClients: totalTraded,
    TotalNonTradedClients: totalNonTraded,
    clientlist,
  };
};

/**
================= BRANCH PERFORMANCE =================
*/

const getBranchPerformance = async (managerId, query) => {
  const { datefrom, dateto } = query;

  if (!datefrom || !dateto) {
    throw new Error("datefrom and dateto are required");
  }

  // local converter (avoid conflict)
  const formatDateLocal = (dateStr) => {
    const [d, m, y] = dateStr.split('-');
    return `${y}-${m}-${d}`;
  };

  const from = formatDateLocal(datefrom);
  const to = formatDateLocal(dateto);

  const rows = await BranchPerformance.findAll({
    where: {
      manager_id: managerId,
      date: {
        [Op.between]: [
          new Date(`${from} 00:00:00`),
          new Date(`${to} 23:59:59`)
        ]
      }
    }
  });

  if (!rows.length) {
    return {
      all_Count: 0,
      perfdata: null
    };
  }

  const r = rows[0];

  return {
    all_Count: rows.length,
    perfdata: {
      BranchCode: r.branch_code,
      BranchName: r.branch_name,
      BranchPan: r.branch_pan || "",
      Address: r.address,
      Mobile: r.mobile,
      Email: r.email,
      GrossRevenue: parseFloat(r.gross_revenue || 0),
      TotalClients: parseInt(r.total_clients || 0),
      ActiveClients: parseInt(r.active_clients || 0),
      MobileAppDownload: parseInt(r.mobile_app_download || 0),
      MFAUM: parseFloat(r.mf_aum || 0),
      MFSIP: parseFloat(r.mf_sip || 0),
      NoOfSIP: parseInt(r.no_of_sip || 0),
      PMSAUM: parseFloat(r.pms_aum || 0),
      WealhBasket: parseFloat(r.wealth_basket || 0),
      PreIPODeals: parseFloat(r.pre_ipo_deals || 0),
      BranchBrokerage: parseFloat(r.branch_brokerage || 0),
      Remark: r.remark
    }
  };
};
/**
================= REACTIVATION REPORT =================
*/

const getReactivationReport = async (managerId, query) => {
  const { pageNumber = 0, size = 50, Search, datefrom, dateto } = query;

  const where = {
    manager_id: managerId
  };

  if (Search) {
    where.client_code = Search;
  }

  if (datefrom && dateto) {
    where.date = {
      [Op.between]: [
        new Date(`${convertDate(datefrom)} 00:00:00`),
        new Date(`${convertDate(dateto)} 23:59:59`)
      ]
    };
  }

  const { count, rows } = await ReactivationReport.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: pageNumber * size
  });

  if (!rows.length) {
    return {
      success: true,
      message: "Data not found !!!",
      result: {
        all_Count: 0,
        numberOfPages: 0,
        rowsPerPage: parseInt(size),
        clientlist: null
      }
    };
  }

  return {
    success: true,
    message: "Reactivation Data",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      clientlist: rows
    }
  };
};
/**
================= SAM PARK REPORT =================
*/
const getSamparkReport = async (managerId, query) => {
  const { pageNumber = 0, size = 50, clientcode, fromDate, ToDate } = query;

  const where = {
    manager_id: managerId
  };

  if (clientcode) {
    where.client_code = clientcode;
  }

  if (fromDate && ToDate) {
    where.call_date = {
      [Op.between]: [
        new Date(`${convertDate(fromDate)} 00:00:00`),
        new Date(`${convertDate(ToDate)} 23:59:59`)
      ]
    };
  }

  const { count, rows } = await SamparkReport.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: pageNumber * size
  });

  if (!rows.length) {
    return {
      success: false,
      message: "No Record Found !!",
      result: {
        all_Count: 0,
        numberOfPages: 0,
        rowsPerPage: parseInt(size),
        CallLogList: []
      }
    };
  }

  return {
    success: true,
    message: "Sampark Data",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      CallLogList: rows
    }
  };
};
/**
 * ================= KRA =================
 */
const getKRA = async (query) => {
  const { clientcode } = query;

  let where = {};

  if (clientcode) {
    where.client_code = clientcode; // ✅ exact match
  }

  const data = await KRAStatus.findAll({ where });

  return {
    success: true,
    message: data.length ? "Data found" : "No data",
    result: { clientlist: data }
  };
};

/**
 * ================= HOLD KRA =================
 */
const getHoldKRA = async (managerId, query) => {
  const { Search } = query;

  const where = {};

  if (Search) {
    where.client_code = { [Op.like]: `%${Search}%` };
  }

  const rows = await HoldKRA.findAll({ where });

  return {
    success: true,
    message: rows.length ? "Hold KRA Data" : "No data",
    result: {
      all_Count: rows.length,
      clientlist: rows
    }
  };
};

/**
 * ================= MODIFICATION =================
 */
const getModification = async (managerId, query) => {
  const { clientcode } = query;

  const where = {};

  if (clientcode) {
    where.client_code = clientcode; // ✅ exact match
  }

  const rows = await Modification.findAll({ where });

  return {
    success: true,
    message: rows.length ? "Modification Data" : "No data",
    result: {
      all_Count: rows.length,
      clientlist: rows
    }
  };
};
/**
 * ================= PHYSICAL =================
 */
const getPhysical = async (managerId, query) => {
  const { clientcode } = query;

  const where = {};

  if (clientcode) {
    where.client_code = clientcode; // ✅ exact match
  }

  const rows = await PhysicalAccount.findAll({ where });

  return {
    success: true,
    message: rows.length ? "Physical Data" : "No data",
    result: {
      all_Count: rows.length,
      clientlist: rows
    }
  };
};
/**
 * ================= NOMINEE PENDING =================
 */
const getNomineePending = async (query) => {
  const { client_code = '', client_name = '', mobile = '' } = query;

  let where = {};

  if (client_code) {
    where.client_code = { [Op.like]: `%${client_code}%` };
  }

  if (client_name) {
    where.client_name = { [Op.like]: `%${client_name}%` };
  }

  if (mobile) {
    where.mobile = { [Op.like]: `%${mobile}%` };
  }

  const data = await NomineePending.findAll({ where });

  return {
    success: true,
    message: data.length ? "Data fetched successfully" : "Data not found !!!",
    result: {
      all_Count: data.length,
      clientlist: data.length ? data : null
    }
  };
};
/**
 * ================= COMPLIANCE CIRCULAR =================
 */

const getComplianceCircular = async (query) => {
  const { datefrom, dateto, type } = query;

  let where = {};

  if (datefrom && dateto) {
    const from = convertDate(datefrom);
    const to = convertDate(dateto);

    where.date = {
      [Op.between]: [
        `${from} 00:00:00`,
        `${to} 23:59:59`
      ]
    };
  }

  if (type) {
    where.compliance_type = type;
  }

  const data = await ComplianceCircular.findAll({
    where,
    order: [['date', 'DESC']]
  });

  return {
    success: true,
    message: data.length ? "Data fetched successfully" : "Data not found !!!",
    result: {
      total: data.length,
      circulars: data
    }
  };
};

/**
 * ================= MARKETING MATERIAL =================
 */
const getMarketingMaterial = async (query) => {
  const { pageNumber = 0, size = 50, category } = query;

  let where = {};

  // optional category filter
  if (category) {
    where.category = category;
  }

  const limit = parseInt(size);
  const offset = parseInt(pageNumber) * limit;

  const { count, rows } = await MarketingMaterial.findAndCountAll({
    where,
    limit,
    offset,
    order: [['create_date', 'DESC']]
  });

  return {
    success: true,
    message: "Details!!",   // 👈 ALWAYS SAME (as per your requirement)
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / limit),
      rowsPerPage: limit,
      clientlist: rows.map(item => ({
        Category: item.category,
        FileName: item.file_name,
        FileUrl: item.file_url || "url_here", // fallback
        CreateDate: item.create_date
      }))
    }
  };
};

/**
 * ================= DOWNLOAD FILES =================
 */
const getDownloadFiles = async () => {
  const data = await DownloadFile.findAll({
    order: [['category', 'ASC']]
  });

  const grouped = {};

  data.forEach(item => {
    const category = item.category;
    const subcategory = item.subcategory;

    if (!grouped[category]) {
      grouped[category] = {};
    }

    if (!grouped[category][subcategory]) {
      grouped[category][subcategory] = [];
    }

    grouped[category][subcategory].push({
      FileName: item.file_name,
      URL: item.file_url
    });
  });

  const result = Object.keys(grouped).map(cat => ({
    categoryName: cat,
    subcategory: Object.keys(grouped[cat]).map(sub => ({
      subcategoryName: sub,
      fileDetail: grouped[cat][sub]
    }))
  }));

  return {
    success: true,
    message: null,
    result
  };
};


/**
 * ================= CERTIFICATES =================
 */
const getCertificates = async () => {
  const rows = await Certificate.findAll({
    order: [['createdAt', 'DESC']]
  });

  return {
    success: true,
    message: rows.length ? "Details!!" : "Data not found !!!",
    result: {
      all_Count: rows.length,
      certificatelist: rows.length
        ? rows.map(item => ({
          CertificateName: item.certificate_name,
          FileUrl: item.certificate_file_url,
          IssueDate: item.issue_date,
          ExpiryDate: item.expiry_date
        }))
        : null
    }
  };
};
/**
 * ================= UPLOAD CERTIFICATES =================
 */
const uploadCertificate = async (file) => {
  if (!file) {
    throw new Error("File is required");
  }

  const data = await UploadCertificate.create({
    file_name: file.originalname,
    file_url: file.path
  });

  return {
    success: true,
    message: "Certificate uploaded successfully",
    result: data
  };
};
/**
 * ================= MTF BALANCE =================
 */
const getMtfBalance = async (query) => {
  const { pageNumber = 0, size = 50, clientcode } = query;

  const where = {};
  if (clientcode) {
    where.client_code = clientcode;
  }

  const { count, rows } = await MtfBalance.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: pageNumber * size,
    order: [["createdAt", "DESC"]],
  });

  if (count === 0) {
    return {
      success: false,
      message: "no record found",
      result: {
        all_Count: 0,
        numberOfPages: 0,
        rowsPerPage: 0,
        balancelist: []
      }
    };
  }

  return {
    success: true,
    message: "Details!!",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: size,
      balancelist: rows
    }
  };
};



const { MTFRequestReport } = require('../models');
const moment = require('moment');

const getMTFReport = async (query) => {
  const {
    pageNumber = 0,
    size = 50,
    requestdate,
    Search
  } = query;

  let where = {};

  // 📅 DATE FILTER
  if (requestdate) {
    const date = moment(requestdate, "DD-MM-YYYY").format("YYYY-MM-DD");
    where.request_date = date;
  }

  // 🔍 CLIENT CODE SEARCH
  if (Search) {
    where.client_code = {
      [Op.like]: `%${Search}%`
    };
  }

  const { count, rows } = await MTFRequestReport.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size),
    order: [['request_date', 'DESC']]
  });

  return {
    success: true,
    message: count ? "Data fetched successfully" : "no record found",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      Mtflist: rows
    }
  };
};

const { IPOReport } = require('../models');

const getIPOReport = async (query) => {
  const {
    pageNumber = 0,
    size = 50,
    datefrom,
    dateto
  } = query;

  let where = {};

  // 📅 DATE FILTER
  if (datefrom && dateto) {
    const from = moment(datefrom, "DD-MM-YYYY").format("YYYY-MM-DD");
    const to = moment(dateto, "DD-MM-YYYY").format("YYYY-MM-DD");

    where.application_date = {
      [Op.between]: [from, to]
    };
  }

  const { count, rows } = await IPOReport.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size),
    order: [['application_date', 'DESC']]
  });

  return {
    success: count ? true : false,
    message: count ? "Data fetched successfully" : "no record found",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      IPOlist: rows
    }
  };
};

const { DPSlip } = require('../models');

const getDPSlip = async (query) => {
  const { ClientCode, datefrm, dateto } = query;

  // ❌ validation
  if (!ClientCode) {
    return {
      success: false,
      message: "ClientCode is required",
      result: {}
    };
  }

  // 📅 date convert
  const from = moment(datefrm, ["DD-MM-YYYY","D-M-YYYY"]).format("YYYY-MM-DD");
  const to = moment(dateto, ["DD-MM-YYYY","D-M-YYYY"]).format("YYYY-MM-DD");

  // 🔍 find data
  const data = await DPSlip.findOne({
    where: {
      client_code: ClientCode,
      from_date: { [Op.lte]: from },
      to_date: { [Op.gte]: to }
    }
  });

  // ❌ not found
  if (!data) {
    return {
      success: false,
      message: "Invalid Client Code",
      result: {
        all_Count: 0,
        numberOfPages: 0,
        rowsPerPage: 0,
        FileData: null
      }
    };
  }

  // ✅ success
  return {
    success: true,
    message: "File found",
    result: {
      all_Count: 1,
      numberOfPages: 1,
      rowsPerPage: 1,
      FileData: {
        ...data.toJSON(),
        file_url: `http://localhost:5000/${data.file_url}` // 🔥 open file
      }
    }
  };
};

const { ResearchCall } = require('../models');

const getResearchCalls = async (searchType) => {
  const rows = await ResearchCall.findAll({
    where: {
      call_type: searchType
    },
    order: [['call_date', 'DESC']]
  });

  return {
    success: true,
    message: rows.length ? null : "Data Not Found. ",
    count: rows.length,
    result: rows.map(item => ({
      DateTime: item.call_date,
      Segment: item.segment,
      Message: item.message
    }))
  };
};

const { AlgoBrokerage } = require('../models');

const getAlgoBrokerage = async (query) => {
  const { pageNumber = 0, size = 50, datefrom, dateto } = query;

  let where = {};

  if (datefrom && dateto) {
    const from = moment(datefrom, "DD-MM-YYYY").startOf('day').format("YYYY-MM-DD HH:mm:ss");
    const to = moment(dateto, "DD-MM-YYYY").endOf('day').format("YYYY-MM-DD HH:mm:ss");
    where.report_date = {
      [Op.between]: [from, to]
    };
  }

  const limit = parseInt(size, 10) || 50;
  const offset = parseInt(pageNumber, 10) * limit || 0;

  const { count, rows } = await AlgoBrokerage.findAndCountAll({
    where,
    limit,
    offset,
    order: [['report_date', 'DESC']]
  });

  return {
    success: true,
    message: count ? "Data fetched successfully" : "no record found",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / limit),
      rowsPerPage: limit,
      AlgoBrokerageList: rows
    }
  };
};

const { MutualFund } = require('../models');

const getMutualFundReport = async (query) => {
  const {
    apcode,
    datefrm,
    dateto,
    pageNumber = 0,
    size = 50
  } = query;

  let where = {};

  // 🔍 Commission Account Filter
  if (apcode) {
    where.commission_account = apcode;
  }

  // 📅 Date Filter
  if (datefrm && dateto) {
    const from = moment(datefrm, "DD-MM-YYYY").format("YYYY-MM-DD");
    const to = moment(dateto, "DD-MM-YYYY").format("YYYY-MM-DD");
    where.date = {
      [Op.between]: [from, to]
    };
  }

  const { count, rows } = await MutualFund.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size),
    order: [['date', 'DESC']]
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / size),
    rowsPerPage: parseInt(size),
    MfAdmin: rows
  };
};

const { MutualFundRejection } = require('../models');

const getMfRejectionReport = async (query) => {
  let { datefrm, dateto, Search, pageNumber = 0, size = 50 } = query;

  let where = {};

  // 🔍 client code search
  if (Search) {
    where.client_code = Search;
  }

  // 📅 date filter
  if (datefrm && dateto) {
    const from = moment(datefrm, "DD-MM-YYYY").startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const to = moment(dateto, "DD-MM-YYYY").endOf("day").format("YYYY-MM-DD HH:mm:ss");

    where.sip_date = {
      [Op.between]: [from, to]
    };
  }

  const { count, rows } = await MutualFundRejection.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size),
    order: [['sip_date', 'DESC']]
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / size),
    rowsPerPage: parseInt(size),
    MfRejection: rows.length ? rows : []
  };
};

const { MfMandateReport } = require('../models');

const getMfMandateReport = async (query) => {
  let { datefrm, dateto, Search, pageNumber = 0, size = 50 } = query;

  let where = {};

  // 🔍 client code search
  if (Search) {
    where.client_code = Search;
  }

  // 📅 date filter
  if (datefrm && dateto) {
    const from = moment(datefrm, "DD-MM-YYYY").startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const to = moment(dateto, "DD-MM-YYYY").endOf("day").format("YYYY-MM-DD HH:mm:ss");

    where.mandate_date = {
      [Op.between]: [from, to]
    };
  }

  const { count, rows } = await MfMandateReport.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size),
    order: [['mandate_date', 'DESC']]
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / size),
    rowsPerPage: parseInt(size),
    MfMandate: rows.length ? rows : null
  };
};

const { BondOffer } = require('../models');

const getBondOffers = async () => {
  const data = await BondOffer.findAll({
    order: [['id', 'DESC']]
  });

  return {
    all_Count: data.length,
    numberOfPages: 0,
    rowsPerPage: 0,
    current: 1,
    total: data.length,
    length: data.length,
    offerlist: data
  };
};

const { ContestData, InactiveClient, FollowUpCall, Payout } = require('../models');

const getContestData = async (query) => {
  let { pageNumber = 0, size = 50, Search } = query;

  pageNumber = parseInt(pageNumber);
  size = parseInt(size);

  let where = {};

  // 🔍 ONLY branch_code + client_code
  if (Search) {
    where = {
      [Op.or]: [
        { client_code: { [Op.like]: `%${Search}%` } },
        { branch_code: { [Op.like]: `%${Search}%` } }
      ]
    };
  }

  const { count, rows } = await ContestData.findAndCountAll({
    where,
    limit: size,
    offset: pageNumber * size,
    order: [['id', 'DESC']]
  });

  return {
    all_Count: count,
    numberOfPages: Math.ceil(count / size),
    rowsPerPage: size,
    list: rows
  };
};

const getInactiveClients = async (query) => {
  const { pageNumber = 0, size = 50 } = query;

  const { count, rows } = await InactiveClient.findAndCountAll({
    limit: parseInt(size),
    offset: parseInt(pageNumber * size)
  });

  return {
    success: true,
    message: "InActive Client Details",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      clientlist: rows.map(item => ({
        ClientCode: item.client_code,
        ClientName: item.client_name,
        Mobile: item.mobile,
        Email: item.email,
        PanNumber: item.pan_number,
        Whatsapp: item.whatsapp,
        Remark: item.remark,
        MobileApp: item.mobile_app,
        Sip: item.sip
      }))
    }
  };
};

const getFollowUpData = async (query) => {
  const { pageNumber = 0, size = 50, ClientCode, CallDate } = query;

  let where = {};

  // ✅ client code filter
  if (ClientCode) {
    where.client_code = ClientCode;
  }

  // ✅ single date filter (DD-MM-YYYY → YYYY-MM-DD)
  if (CallDate) {
    const [day, month, year] = CallDate.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    where.call_date = formattedDate;
  }

  const { count, rows } = await FollowUpCall.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size),
    order: [['call_date', 'DESC']]
  });

  return {
    success: true,
    message: rows.length ? "Details!!" : "Data not found !!!",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      clientlist: rows.length ? rows.map(item => ({
        ClientCode: item.client_code,
        ClientName: item.client_name,
        CallDate: item.call_date,
        Message: item.message,
        Remark: item.remark
      })) : null
    }
  };
};

const getClientBalance = async (query) => {
  const { pageNumber = 0, size = 50, clientcode } = query;

  let where = {};

  if (clientcode) {
    where.client_code = {
      [Op.like]: `%${clientcode}%`
    };
  }

  const { count, rows } = await Payout.findAndCountAll({
    where,
    limit: parseInt(size),
    offset: parseInt(pageNumber * size)
  });

  return {
    success: rows.length ? true : false,
    message: rows.length ? "Data fetched successfully" : "no record found",
    result: {
      all_Count: count,
      numberOfPages: Math.ceil(count / size),
      rowsPerPage: parseInt(size),
      balancelist: rows.map(item => ({
        ClientCode: item.client_code,
        ClientName: item.client_name,
        LedgerBalance: item.ledger_balance,
        AvailableBalance: item.available_balance,
        MarginBalance: item.margin_balance
      }))
    }
  };
};

/**
 * ================= EXPORT =================
 */
module.exports = {
  getDPSlip,
  getIPOReport,
  getMTFReport,
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
  getBrokerageSummary,
  getMobileLoginSummary,
  getMobileLoginReport,
  getBranchPerformance,
  getReactivationReport,
  getSamparkReport,
  getKRA,
  getHoldKRA,
  getModification,
  getPhysical,
  getNomineePending,
  getComplianceCircular,
  getMarketingMaterial,
  getDownloadFiles,
  getCertificates,
  uploadCertificate,
  getMtfBalance,
  getResearchCalls,
  getAlgoBrokerage,
  getMutualFundReport,
  getMfRejectionReport,
  getMfMandateReport,
  getBondOffers,
  getContestData,
  getInactiveClients,
  getFollowUpData,
  getClientBalance

};