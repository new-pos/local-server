"use strict";

const fs = require("fs");
const path = require("path");
const config = fs.readFileSync(path.join(__dirname, "../../config.json"));
const connection = JSON.parse(config).database;
const database = require("knex")({
  connection,
  client: "mysql2",
  pool: { min: 0, max: 7 },
  log: {
    warn(message) {
      console.log("@model.db_connection | ", message);
    },
    error(message) {
      console.log("@model.db_connection | ", message);
    },
    deprecate(message) {
      console.log("@model.db_connection | ", message);
    },
    debug(message) {
      console.log("@model.db_connection | ", message);
    },
  },
});

module.exports = { database };
