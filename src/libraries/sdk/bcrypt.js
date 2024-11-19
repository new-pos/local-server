"use strict"

const bcrypt = require("bcryptjs");
const config = require("../../../config.json");

function hash(password) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const encripted = bcrypt.hashSync(password, salt);

    return encripted;
  } catch (error) {
    console.log(error);

    return error;
  }
}

function verify(password, db_password) {
  try {
    const compare = bcrypt.compareSync(password, db_password);

    return compare;
  } catch (error) {
    return error;
  }
}

module.exports = { hash, verify };
