const BulkPayout = require("../models").bulk_payout;

const uploadBulkPayout = async (file) => {
  try {
    if (!file) {
      throw new Error("File is required");
    }

    // 👉 DB me entry save
    const data = await BulkPayout.create({
      file_name: file.originalname,
      file_path: file.path
    });

    return {
      success: true,
      message: "Bulk payout uploaded successfully",
      result: data
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  uploadBulkPayout
};
