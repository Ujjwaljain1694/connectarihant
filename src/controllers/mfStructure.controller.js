const { getMfStructure } = require("../services/mfStructure.service");

exports.getMfStructureData = async (req, res) => {
  try {
    const response = await getMfStructure(req.query);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
