"use strict"

const sdk = require("../../libraries");

async function get_pending_transaction(request, response) {
  try {
    const shift_running = await sdk.db.shift_running.findOne({});
    
    if (!shift_running) {
      return response.status(404).json({
        message: "No active shift found",
        result: 0
      });
    }

    // Check if shift_running date is in the future
    if (shift_running.createdAt > new Date()) {
      return response.status(400).json({
        message: "Shift running date is in the future",
        shift_date: shift_running.createdAt,
        result: 0
      });
    }

    // Simple query for countDocuments
    const transactionCount = await sdk.db.open_bill.countDocuments({
      createdAt: { $gte: new Date(shift_running.createdAt) }
    });

    console.log("kesini", transactionCount);

    return response.status(200).json({
      message : "Success get_total_transaction",
      result  : transactionCount
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message : "Error get_pending_transaction",
      error   : error.message
    });
  }
}

async function get_total_transaction(request, response) {
  try {
    const shift_running = await sdk.db.shift_running.findOne({});
    
    if (!shift_running) {
      return response.status(404).json({
        message: "No active shift found",
        result: 0
      });
    }

    // Check if shift_running date is in the future
    if (shift_running.createdAt > new Date()) {
      return response.status(400).json({
        message: "Shift running date is in the future",
        shift_date: shift_running.createdAt,
        result: 0
      });
    }

    // Simple query for countDocuments
    const transactionCount = await sdk.db.transaction.countDocuments({
      createdAt: { $gte: new Date(shift_running.createdAt) }
    });

    console.log("kesini", transactionCount);

    return response.status(200).json({
      message : "Success get_total_transaction",
      result  : transactionCount
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
    const shift_running = await sdk.db.shift_running.findOne({});
    
    if (!shift_running) {
      return response.status(404).json({
        message: "No active shift found",
        result: 0
      });
    }

    // Check if shift_running date is in the future
    if (shift_running.createdAt > new Date()) {
      return response.status(400).json({
        message: "Shift running date is in the future",
        shift_date: shift_running.createdAt,
        result: 0
      });
    }

    const transactionCount = await sdk.db.transaction.countDocuments();

    console.log("kesini", transactionCount);
    
    if (transactionCount === 0) {
      return response.status(200).json({
        message: "No transactions found in database",
        result: 0
      });
    }

    // Let's debug the matching transactions
    const [result] = await sdk.db.transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(shift_running.createdAt) }
        }
      },
      {
        $project: {
          grand_total: 1,
          createdAt: 1
        }
      },
      {
        $group: { 
          _id: null, 
          total: { $sum: "$grand_total" },
          transactions: { $push: { grand_total: "$grand_total", createdAt: "$createdAt" } }
        } 
      }
    ]);

    // Log matching transactions for debugging
    console.log("Matching transactions:", result?.transactions);
    console.log("Total sum:", result?.total);

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

async function get_payment_report(request, response) {
  try {
    const shift_running = await sdk.db.shift_running.findOne({});
    
    if (!shift_running) {
      return response.status(404).json({
        message: "No active shift found",
        result: 0
      });
    }

    // Check if shift_running date is in the future
    if (shift_running.createdAt > new Date()) {
      return response.status(400).json({
        message: "Shift running date is in the future",
        shift_date: shift_running.createdAt,
        result: 0
      });
    }

    // Aggregate payments by payment method
    const paymentReport = await sdk.db.transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(shift_running.createdAt) }
        }
      },
      {
        $unwind: "$payment_method"  
      },
      {
        $group: {
          _id: {
            type: "$payment_method.type",
            name: "$payment_method.name"
          },
          total: { $sum: "$payment_method.amount" }
        } 
      },
      {
        $project: {
          _id: 0,
          type: "$_id.type",
          name: "$_id.name",
          total: 1
        }
      }
    ]);

    return response.status(200).json({
      message: "Success get_payment_report",  
      result: paymentReport
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Error get_payment_report",  
      error: error.message
    });
  }
}

async function get_transaction_progress_per_hour(request, response) {
  try {
    const shift_running = await sdk.db.shift_running.findOne({});

    if (!shift_running) {
      return response.status(404).json({
        message: "No active shift found",
        result: 0 
      });
    }

    // Check if shift_running date is in the future
    if (shift_running.createdAt > new Date()) {
      return response.status(400).json({  
        message: "Shift running date is in the future",
        shift_date: shift_running.createdAt,
        result: 0
      });
    }
    
    const hourlyTransactions = await sdk.db.transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(shift_running.createdAt) }
        }
      },
      {
        $project: {
          hour: {
            $add: [
              { $hour: "$createdAt" },
              7  // UTC+7 adjustment
            ]
          },
          grand_total: 1
        }
      },
      {
        $project: {
          hour: {
            $mod: ["$hour", 24]
          },
          grand_total: 1
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 },
          total: { $sum: "$grand_total" }
        }
      },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          count: 1,
          total: 1
        }
      },
      {
        $sort: { hour: 1 }
      }
    ]);

    // Fill in missing hours with 0 values
    const result = Array.from({ length: 24 }, (_, i) => {
      const found = hourlyTransactions.find(t => t.hour === i);
      return {
        hour: i,
        count: found ? found.count : 0,
        total: found ? found.total : 0
      };
    });

    return response.status(200).json({
      message: "Success get_transaction_progress_per_hour",
      result: result
    });
  } catch (error) {
    console.log(error);

    return response.status(500).json({
      message: "Error get_transaction_progress_per_hour",
      error: error.message
    });
  }
}

module.exports = {
  get_total_transaction,
  get_total_sales,
  get_pending_transaction,
  get_payment_report,
  get_transaction_progress_per_hour,
}

// [
//   { hour: 0, count: 93 },
//   { hour: 1, count: 91 },
//   { hour: 2, count: 88 },
//   { hour: 3, count: 56 },
//   { hour: 4, count: 77 },
//   { hour: 5, count: 23 },
//   { hour: 6, count: 57 },
//   { hour: 7, count: 70 },
//   { hour: 8, count: 62 },
//   { hour: 9, count: 73 },
//   { hour: 10, count: 77 },
//   { hour: 11, count: 81 },
//   { hour: 12, count: 9 },
//   { hour: 13, count: 48 },
//   { hour: 14, count: 33 },
//   { hour: 15, count: 80 },
//   { hour: 16, count: 18 },
//   { hour: 17, count: 41 },
//   { hour: 18, count: 47 },
//   { hour: 19, count: 80 },
//   { hour: 20, count: 98 },
//   { hour: 21, count: 51 },
//   { hour: 22, count: 70 },
//   { hour: 23, count: 52 },
// ]