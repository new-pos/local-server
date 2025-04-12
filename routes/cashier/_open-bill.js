"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/open-bill");

router.get("/"            , fn.get_open_bill);
router.get("/info"        , fn.get_open_bill_info);
router.get("/accept-order", fn.accept_customer_order);
router.post("/qr-code"     , fn.print_qr_code);
router.post("/save"       , fn.save_open_bill);
router.post("/save-print" , fn.save_and_print_open_bill);
router.post("/void-item"  , fn.void_table_item);

router.put("/update"      , fn.update_open_bill);
router.put("/update-print", fn.update_and_print_open_bill);

module.exports = router;
