"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/waitress/outlet");

router.get("/info"                 , fn.outlet_info);
router.get("/table"                , fn.table);
router.get("/sales-type"           , fn.sales_type);
router.get("/product-group"        , fn.product_group);
router.get("/product-category"     , fn.product_category);
router.get("/product-subcategory"  , fn.product_sub_category);
router.get("/product"              , fn.list_product);

module.exports = router;
