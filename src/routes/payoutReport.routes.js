module.exports = (app) => {
  const controller = require("../controllers/payoutReport.controller");
  const router = require("express").Router();

  router.get("/payout-report", controller.getPayoutReport);

  app.use("/api/payout", router);
};
