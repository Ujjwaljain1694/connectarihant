const { uploadBulkPayout } = require("../services/bulkPayout.service");

exports.uploadBulk = async (req, res) => {
  try {
    const response = await uploadBulkPayout(req.file);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
