"use strict";

const express = require("express");
const router = express.Router();
const fn = require("../src/controllers/cashier");

router.get("/"         , fn.get_list_cashier);

router.post("/sign-in" , fn.sign_in);
router.post("/"        , fn.set_list_cashier);

module.exports = router;
