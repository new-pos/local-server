"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/shift");

router.get("/running", fn.running_shift);
router.get("/history", fn.shift_history);

router.post("/start"  , fn.start_shift);
router.post("/end"    , fn.end_shift);

module.exports = router;
