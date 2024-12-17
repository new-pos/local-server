"use strict";

const express = require("express");
const router = express.Router();
const { get_list_cashier, set_list_cashier } = require("../src/controllers/cashier");

router.get("/" , get_list_cashier);
router.post("/", set_list_cashier);

module.exports = router;
