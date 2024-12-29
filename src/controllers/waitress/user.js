"use strict";

const sdk = require("../../libraries");

async function sign_in(request, response) {
  try {
    const [cashier] = await sdk.db.cashier.find({
      $or: [
        { email: request.body.user, pin: request.body.pin },
        { phone: request.body.user, pin: request.body.pin }
      ]
    });

    console.log("cashier", cashier);

    return response.json({
      status: cashier ? true : false,
      result: cashier || null,
    });
  } catch (error) {
    console.log("[sign_in].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function user_info(request, response) {
  try {
    return response.send("success > user_info");
  } catch (error) {
    console.log("[user_info].error", error);

    return response.send("failed");
  }
}

module.exports = {
  sign_in,
  user_info,
};
