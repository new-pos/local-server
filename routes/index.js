"use strict";

const express            = require("express");
const router             = express.Router();
const cashier_routes     = require('./cashier');
const waitress_routes    = require('./waitress');

router.use('/cashier' , cashier_routes);
router.use('/waitress', waitress_routes);

module.exports = router;
