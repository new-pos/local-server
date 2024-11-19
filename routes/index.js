"use strict";

const express = require("express");
const router = express();
const middleware = require("../src/middlewares");
const fn = require("../src/controllers/index");

router.get("/"   , fn.index);

module.exports = router;
