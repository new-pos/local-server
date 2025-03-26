"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/outlet");

router.post("/banner"  , fn.set_outlet_banner);
router.post("/info"    , fn.set_outlet_info);
router.post("/payment" , fn.set_outlet_payment);
router.post("/sales-type", fn.set_outlet_sales_type);
router.post("/table"   , fn.set_outlet_table);
router.post("/voucher" , fn.set_outlet_voucher);

router.get("/info/:outletid"    , fn.get_outlet_info);
router.get("/table"   , fn.get_outlet_table);
router.get("/sales-type", fn.get_outlet_sales_type);
router.get("/payment" , fn.get_outlet_payment);
router.get("/banner"  , fn.get_outlet_banner);
router.get("/voucher" , fn.get_outlet_voucher);

module.exports = router;