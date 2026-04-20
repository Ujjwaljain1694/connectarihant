const db = require("../models");
const Payout = db.payout_report;

exports.getPayoutReport = async (req, res) => {
  try {
    let { size, pageNumber, requestdate } = req.query;

    size = parseInt(size) || 50;
    pageNumber = parseInt(pageNumber) || 0;
    const offset = pageNumber * size;

    let whereCondition = {};

    // ✅ DATE FILTER (only search)
    if (requestdate && requestdate.trim() !== "") {
      const [day, month, year] = requestdate.split("-");
      whereCondition.request_date = `${year}-${month}-${day}`;
    }

    const { count, rows } = await Payout.findAndCountAll({
      where: whereCondition,
      limit: size,
      offset: offset,
      order: [["request_date", "DESC"]]
    });

    return res.json({
      success: true,
      message: rows.length ? "Data fetched successfully" : "no record found",
      result: {
        all_Count: count,
        numberOfPages: Math.ceil(count / size),
        rowsPerPage: size,
        Payoutlist: rows
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
