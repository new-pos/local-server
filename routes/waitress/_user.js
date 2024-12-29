"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/waitress/user");

router.get("/info" , fn.user_info);

router.post("/sign-in" , fn.sign_in);

module.exports = router;
