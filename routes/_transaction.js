"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../src/controllers/transaction");

router.post("/"        , fn.create_transaction);

module.exports = router;
