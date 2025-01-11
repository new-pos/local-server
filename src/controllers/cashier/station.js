"use strict"

const sdk = require("../../libraries");

async function get_list_station(request, response) {
  try {
    const [station] = await sdk.db.station.find({});

    return response.status(200).json({
      message: "Success get_list_station",
      result : station,
    });
  } catch (error) {
    console.log("Error get_list_station", error);

    return response.status(500).json({
      message: "Error get_list_station",
      error,
    });
  }
}

async function set_list_station(request, response) {
  try {
    await sdk.db.station.deleteMany();

    if (request.body && request.body.length > 0) {
      await sdk.db.station.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_list_station",
    });
  } catch (error) {
    console.log("Error set_list_station", error);

    return response.status(500).json({
      message: "Error set_list_station",
      error,
    });
  }
}

module.exports = {
  get_list_station,
  set_list_station,
};
