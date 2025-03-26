"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/report");

router.get("/total-transaction"  , fn.get_total_transaction);
router.get("/total-sales"        , fn.get_total_sales);
router.get("/pending-transaction", fn.get_pending_transaction);
router.get("/payment-report"     , fn.get_payment_report);
router.get("/progress-per-hour"  , fn.get_transaction_progress_per_hour);

module.exports = router;
