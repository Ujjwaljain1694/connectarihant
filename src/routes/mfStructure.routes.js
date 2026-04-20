module.exports = (app) => {
  const controller = require("../controllers/mfStructure.controller");
  const router = require("express").Router();

  router.get("/mf-structure", controller.getMfStructureData);

  app.use("/api/reports", router);
};
