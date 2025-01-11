"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/report");

router.get("/total-transaction" , fn.get_total_transaction);
router.get("/total-sales"       , fn.get_total_sales);

module.exports = router;
