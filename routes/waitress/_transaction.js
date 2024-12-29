"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/waitress/transaction");

router.get("/history"         , fn.history_transaction);
router.get("/notification"    , fn.waitress_notification);

router.post("/create"         , fn.create_transaction);
router.post("/update"         , fn.update_transaction);
router.post("/transfer-table" , fn.transfer_table);

module.exports = router;