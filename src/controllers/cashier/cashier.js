"use strict"

const sdk = require("../../libraries");

async function sign_in(request, response) {
  try {
    const [cashier] = await sdk.db.cashier.find({
      $or: [
        { email: request.body.user, pin: request.body.pin },
        { phone: request.body.user, pin: request.body.pin }
      ]
    });

    if (!cashier) {
      return response.status(404).json({
        message: "Invalid user or pin",
      });
    }

    return response.status(200).json({
      message: "Success sign_in",
      result : cashier,
    });
  } catch (error) {
    console.log("Error sign_in", error);

    return response.status(500).json({
      message: "Error sign_in",
      error,
    });
  }
}

async function get_list_cashier(request, response) {
  try {
    const cashier = await sdk.db.cashier.find({}, { cashier_id: 1, email: 1 });

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

async function set_list_cashier(request, response) {
  try {
    await sdk.db.cashier.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, cashier_id: item.id }));

      await sdk.db.cashier.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_list_cashier",
    });
  } catch (error) {
    console.log("Error set_list_cashier", error);

    return response.status(500).json({
      message: "Error set_list_cashier",
      error,
    });
  }
}

module.exports = {
  get_list_cashier,
  set_list_cashier,
  sign_in,
};
