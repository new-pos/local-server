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
const discount_routes    = require('./_discount');
const notification_routes = require('./_notification');
const open_bill_routes   = require('./_open-bill');

router.use('/'            , cashier_routes);
router.use('/outlet'      , outlet_routes);
router.use('/customer'    , customer_routes);
router.use('/product'     , product_routes);
router.use('/transaction' , transaction_routes);
router.use('/shift'       , shift_routes);
router.use('/station'     , station_routes);
router.use('/report'      , report_routes);
router.use('/discount'    , discount_routes);
router.use('/notification', notification_routes);
router.use('/open-bill'   , open_bill_routes);

module.exports = router;
