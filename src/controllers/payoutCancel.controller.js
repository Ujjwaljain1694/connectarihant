const db = require("../models");
const PayoutCancel = db.payout_cancel;
const { Op } = require("sequelize");

exports.getCancelRequest = async (req, res) => {
  try {
    let { size, pageNumber, requestdate, clientcode } = req.query;

    size = parseInt(size) || 50;
    pageNumber = parseInt(pageNumber) || 0;
    const offset = pageNumber * size;

    let whereCondition = {};

    // ✅ Date filter (single date)
    if (requestdate) {
      const [day, month, year] = requestdate.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      whereCondition.request_date = formattedDate;
    }

    // ✅ Client code filter
    if (clientcode) {
      whereCondition.client_code = clientcode;
      // partial search chahiye ho toh:
      // whereCondition.client_code = { [Op.like]: `%${clientcode}%` };
    }

    const { count, rows } = await PayoutCancel.findAndCountAll({
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
