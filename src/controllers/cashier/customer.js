"use strict"

async function get_list_customer(request, response) {
  try {
    return response.status(200).json({
      message: "Success get_list_customer",
    });
  } catch (error) {
    console.log("Error get_list_customer", error);

    return response.status(500).json({
      message: "Error get_list_customer",
      error: error,
    });
  }
}

async function set_list_customer(request, response) {
  try {
    return response.status(200).json({
      message: "Success set_list_customer",
    });
  } catch (error) {
    console.log("Error set_list_customer", error);

    return response.status(500).json({
      message: "Error set_list_customer",
      error: error,
    });
  }
}

module.exports = {
  get_list_customer,
  set_list_customer,
};
