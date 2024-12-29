"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/customer");

router.get("/" , fn.get_list_customer);
router.post("/", fn.set_list_customer);

module.exports = router;