"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../../src/controllers/waitress/user");

router.get("/info" , fn.user_info);
router.get("/account" , fn.get_list_account);
router.get("/", fn.get_list_user)

router.post("/sign-in" , fn.sign_in);

module.exports = router;
