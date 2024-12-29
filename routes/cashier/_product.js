"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/cashier/product");

router.get("/group"         , fn.get_product_group);
router.get("/category"      , fn.get_product_category);
router.get("/sub-category"  , fn.get_product_sub_category);
router.get("/"              , fn.get_product);

router.post("/group"        , fn.set_product_group);
router.post("/category"     , fn.set_product_category);
router.post("/sub-category" , fn.set_product_sub_category);
router.post("/"             , fn.set_product);

module.exports = router;
