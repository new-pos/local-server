"use strict"

const sdk = require("../../libraries");

async function get_list_discount(request, response) {
  try {
    const discount = await sdk.db.discount.find({});

    return response.status(200).json({
      message: "Success get_list_discount",
      result : discount,
    });
  } catch (error) {
    console.log("Error get_list_discount", error);

    return response.status(500).json({
      message: "Error get_list_discount",
      error,
    });
  }
}

async function set_list_discount(request, response) {
  try {
    await sdk.db.discount.deleteMany();

    if (request.body && request.body.length > 0) {
      await sdk.db.discount.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_list_discount",
    });
  } catch (error) {
    console.log("Error set_list_discount", error);

    return response.status(500).json({
      message: "Error set_list_discount",
      error,
    });
  }
}

module.exports = {
  get_list_discount,
  set_list_discount,
};
