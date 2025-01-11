"use strict"

const sdk = require("../../libraries");

async function get_total_transaction(request, response) {
  try {
    // Get today's start and end dates in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Log the query parameters for debugging
    console.log("Query date range:", {
      start: today.toISOString(),
      end: tomorrow.toISOString()
    });

    // Count transactions for today
    const todayCount = await sdk.db.transaction.countDocuments({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

    console.log("Today's transaction count:", todayCount);

    return response.status(200).json({
      message : "Success get_total_transaction",
      result  : todayCount
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message : "Error get_total_transaction",
      error   : error.message
    });
  }
}

async function get_total_sales(request, response) {
  try {
    const [result] = await sdk.db.transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$grand_total" } } }
    ]);

    console.log("Total sales:", result);

    return response.status(200).json({
      message : "Success get_total_sales",
      result  : result?.total || 0,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message : "Error get_total_sales",
      error   : error.message
    });
  }
}

module.exports = {
  get_total_transaction,
  get_total_sales,
}