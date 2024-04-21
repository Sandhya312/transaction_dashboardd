const express = require("express");
const router = express.Router();
const {
  transactionsController,
  statisticsController,
  barChartController,
  pieChartController,
  transactionDatController,
} = require("../controller/transaction.controller");

router.get("/transactions/:month", transactionsController);

router.get("/statistics/:month", statisticsController);

router.get("/bar-chart/:month", barChartController);

router.get("/pie-chart/:month", pieChartController);

router.get("/transaction-data/:month", transactionDatController);

module.exports = router;
