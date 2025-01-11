"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/transaction");

router.get("/order-number" , fn.get_order_number);
router.get("/history"      , fn.get_history_transaction);

router.post("/"            , fn.create_transaction);

module.exports = router;
