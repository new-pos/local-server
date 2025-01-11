"use strict";

const sdk = require("../../libraries");

async function sign_in(request, response) {
  try {
    console.log("???");
    
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

async function get_list_user(request, response) {
  try {
    const cashier = await sdk.db.cashier.find({}, { cashier_id: 1, email: 1, name: 1, phone: 1 });

    return response.status(200).json({
      message: "Success get_list_cashier",
      result : cashier,
    });
  } catch (error) {
    console.log("Error get_list_cashier", error);

    return response.status(500).json({
      message: "Error get_list_cashier",
      error,
    });
  }
}

module.exports = {
  sign_in,
  user_info,
  get_list_user,
};
