module.exports = (app) => {
  const controller = require("../controllers/payoutCancel.controller");

  const router = require("express").Router();

  // GET API
  router.get("/cancel-request", controller.getCancelRequest);

  app.use("/api/payout", router);
};
