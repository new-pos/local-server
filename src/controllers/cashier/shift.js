"use strict"

const sdk = require("../../libraries");

async function running_shift(request, response) {
  try {
    console.log("running_shift");

    const shift = await sdk.db.shift_running.findOne({
      user_id : +request.query.uid,
    });

    // need to get incomes process here

    console.log("shift", shift);

    return response.status(200).json({
      message: "Success running_shift",
      result : shift,
    });
  } catch (error) {
    console.log("Error running_shift", error);

    return response.status(500).json({
      message: "Error running_shift",
      error: error,
    });
  }
}

async function start_shift(request, response) {
  try {
    console.log("start_shift", request.body);

    const shift = await sdk.db.shift_running.create({ ...request.body });

    console.log("shift", shift);

    return response.status(200).json({
      message: "Success start_shift",
      result : shift,
    });
  } catch (error) {
    console.log("Error start_shift", error);

    return response.status(500).json({
      message: "Error start_shift",
      error: error,
    });
  }
}

async function end_shift(request, response) {
  try {
    console.log("end_shift", request.body);

    const running_shift = await sdk.db.shift_running.findOne({
      user_id : request.body.uid,
      source  : request.body.source,
    });

    console.log("running_shift", running_shift);

    if (!running_shift) {
      return response.status(404).json({
        message: "Shift not found",
      });
    }

    const shiftData = running_shift.toObject ? running_shift.toObject() : running_shift;
    
    await sdk.db.shift.create({
      user_id     : shiftData.user_id,
      start_cash  : shiftData.start_shift,
      actual_cash : request.body.actual_cash,
      source      : request.body.source,
      notes       : request.body.notes,
      started_at  : shiftData.createdAt,
      ended_at    : new Date(),
    });
    await sdk.db.shift_running.findOneAndDelete({
      user_id : request.body.uid,
      source  : request.body.source,
    });

    return response.status(200).json({
      message: "Success end_shift",
    });
  } catch (error) {
    console.log("Error end_shift", error);

    return response.status(500).json({
      message: "Error end_shift",
      error: error,
    });
  }
}

async function shift_history(request, response) {
  try {
    console.log("shift_history");
    const shift = await sdk.db.shift.find({
      user_id : +request.query.uid,
    }).sort({ createdAt: -1 });

    return response.status(200).json({
      message: "Success shift_history",
      data: shift,
    });
  } catch (error) {
    console.log("Error shift_history", error);

    return response.status(500).json({
      message: "Error shift_history",
      error: error,
    });
  }
}

module.exports = {
  running_shift,
  start_shift,
  end_shift,
  shift_history,
};
