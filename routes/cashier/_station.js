"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/station");

router.get("/"         , fn.get_list_station);
router.post("/"        , fn.set_list_station);

module.exports = router;
