const db = require("../models");
const MfStructure = db.mf_structure;

const getMfStructure = async (query) => {
  const { pageNumber = 0, size = 50 } = query;

  const { count, rows } = await MfStructure.findAndCountAll({
    limit: parseInt(size),
    offset: pageNumber * size,
    order: [["createdAt", "DESC"]],
  });

  if (count === 0) {
    return {
      success: true,
      message: "no record found",
      result: {
        all_Count: 0,
        numberOfPages: 0,
        rowsPerPage: 0,
        clientlist: []
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
      clientlist: rows.map(item => ({
        FinancialYear: item.financial_year,
        FileName: item.file_name
      }))
    }
  };
};

module.exports = {
  getMfStructure
};
