"use strict"

async function index(request, response) {
  try {
    console.log("index.started!");

    return response.status(400).send("REQUEST FAILED!");
  } catch (error) {
    console.log("index", error);

    return response.status(400).send("REQUEST FAILED!");
  }
}

module.exports = { index };