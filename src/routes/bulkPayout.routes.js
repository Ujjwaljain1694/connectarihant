const express = require("express");
const router = express.Router();
const controller = require("../controllers/bulkPayout.controller");
const customUpload = require("../middlewares/rawUpload");
const { authenticate } = require("../middlewares/authMiddleware");

router.post(
  "/bulk-upload",
  authenticate,
  customUpload,
  controller.uploadBulk
);

module.exports = router;
