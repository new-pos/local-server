"use strict"

const sdk = require("../libraries");

async function create_transaction(request, response) {
  try {
    console.log("create_transaction", JSON.stringify(request.body, null, 2));

    // const transaction = await sdk.db.transaction.create(request.body);

    return response.status(200).json({
      message: "Success create_transaction",
      result : null,
    });
  } catch (error) {
    console.log("Error create_transaction", error);
  }
}

module.exports = {
  create_transaction,
};
