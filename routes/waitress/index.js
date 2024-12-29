"use strict";

const express            = require("express");
const router             = express.Router();
const outlet_routes      = require('./_outlet');
const transaction_routes = require('./_transaction');
const user_routes        = require('./_user');

router.use('/outlet'      , outlet_routes);
router.use('/transaction' , transaction_routes);
router.use('/user'        , user_routes);

module.exports = router;
