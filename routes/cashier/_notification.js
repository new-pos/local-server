"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/notification");

router.get("/"         , fn.get_list_notification);

module.exports = router;
