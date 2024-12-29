"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/transaction");

router.post("/"        , fn.create_transaction);

module.exports = router;
