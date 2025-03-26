"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/discount");

router.get("/"         , fn.get_list_discount);
router.post("/"        , fn.set_list_discount);

module.exports = router;
