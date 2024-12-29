
async function create_transaction(request, response) {
  try {
    return response.send("success > create_transaction");
  } catch (error) {
    console.log("[create_transaction].error", error);

    return response.send("failed");
  }
}

async function update_transaction(request, response) {
  try {
    return response.send("success > update_transaction");
  } catch (error) {
    console.log("[update_transaction].error", error);

    return response.send("failed");
  }
}

async function transfer_table(request, response) {
  try {
    return response.send("success > transfer_table");
  } catch (error) {
    console.log("[transfer_table].error", error);

    return response.send("failed");
  }
}

async function history_transaction(request, response) {
  try {
    return response.send("success > history_transaction");
  } catch (error) {
    console.log("[history_transaction].error", error);

    return response.send("failed");
  }
}

async function waitress_notification(request, response) {
  try {
    return response.send("success > waitress_notification");
  } catch (error) {
    console.log("[waitress_notification].error", error);

    return response.send("failed");
  }
}

module.exports = {
  create_transaction,
  update_transaction,
  transfer_table,
  history_transaction,
  waitress_notification,
};
