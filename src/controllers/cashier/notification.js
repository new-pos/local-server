"use strict"

const sdk = require("../../libraries");

async function get_list_notification(request, response) {
  try {
    const notification = await sdk.db.notification
      .find({})
      .sort({ createdAt: -1 });

    return response.status(200).json({
      message: "Success get_list_notification",
      result : notification,
    });
  } catch (error) {
    console.log("Error get_list_station", error);

    return response.status(500).json({
      message: "Error get_list_notification",
      error,
    });
  }
}

module.exports = {
  get_list_notification,
};
