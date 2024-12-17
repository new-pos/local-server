"use strict";

const config = require("../../config.json");
const bcrypt = require("./sdk/bcrypt");
const help = require("../helpers");
const mailer = require("./sdk/mailer");
const gcs = require("./sdk/gcs");
const db = require("../models/mongodb");

module.exports = {
  help,
  config,
  db,
  ...bcrypt,
  ...mailer,
  ...gcs,
};
