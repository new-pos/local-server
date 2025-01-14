"use strict";

const express            = require("express");
const router             = express.Router();
const cashier_routes     = require('./_cashier');
const outlet_routes      = require('./_outlet');
const customer_routes    = require('./_customer');
const product_routes     = require('./_product');
const transaction_routes = require('./_transaction');
const shift_routes       = require('./_shift');
const station_routes     = require('./_station');
const report_routes      = require('./_report');

router.use('/'            , cashier_routes);
router.use('/outlet'      , outlet_routes);
router.use('/customer'    , customer_routes);
router.use('/product'     , product_routes);
router.use('/transaction' , transaction_routes);
router.use('/shift'       , shift_routes);
router.use('/station'     , station_routes);
router.use('/report'      , report_routes);

module.exports = router;
