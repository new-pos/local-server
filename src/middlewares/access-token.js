"use strict";

const jwt = require("jsonwebtoken");
const config = require("../../config.json");

async function check_access(request, response, next) {
  try {
    // console.log(request.headers["authorization"]);
    const verify = jwt.verify(
      request.headers["authorization"].replace("Bearer ", ""),
      config.session.key
    );

    console.log("verify", verify);

    request.access = verify;

    console.log("=============================================");
    console.log("|| Timestamp >>>>", new Date());
    console.log("|| Action performed by", request.access.email);
    console.log("=============================================");

    next();
  } catch (error) {
    console.log(error);

    return response.json({
      status : false,
      error  : error.message
    });
  }
}

module.exports = check_access;
