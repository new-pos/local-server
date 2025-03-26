"use strict"

const sdk = require("../../libraries");

async function set_outlet_banner(request, response) {
  try {
    await sdk.db.banner.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, banner_id: item.id }));

      await sdk.db.banner.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_outlet_banner",
    });
  } catch (error) {
    console.log("Error set_outlet_banner", error);

    return response.status(500).json({
      message: "Error set_outlet_banner",
      error: error,
    });
  }
}

async function set_outlet_info(request, response) {
  try {
    console.log("request.body", request.body);
    
    await sdk.db.outlet.deleteMany();

    request.body.outlet_id = request.body.id;

    await sdk.db.outlet.insertMany(request.body);

    return response.status(200).json({
      message: "Success set_outlet_info",
    });
  } catch (error) {
    console.log("Error set_outlet_info", error);

    return response.status(500).json({
      message: "Error set_outlet_info",
      error: error,
    });
  }
}

async function set_outlet_payment(request, response) {
  try {
    await sdk.db.payment.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, payment_id: item.id }));

      await sdk.db.payment.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_outlet_payment",
    });
  } catch (error) {
    console.log("Error set_outlet_payment", error);

    return response.status(500).json({
      message: "Error set_outlet_payment",
      error: error,
    });
  }
}

async function set_outlet_sales_type(request, response) {
  try {
    await sdk.db.sales_type.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, sales_type_id: item.id }));

      await sdk.db.sales_type.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_outlet_sales_type",
    });
  } catch (error) {
    console.log("Error set_outlet_sales_type", error);

    return response.status(500).json({
      message: "Error set_outlet_sales_type",
      error: error,
    });
  }
}

async function set_outlet_table(request, response) {
  try {
    const tables = await sdk.db.table.find({
      "tables.is_occupied": true  // Only get stations where printer field is not null
    });
    const list_occupied_tables = [];
    
    for (let table of tables) {
      table = table.toObject();

      table.tables.forEach((item) => {
        if (item.is_occupied) {
          list_occupied_tables.push(item.id);
        }
      });
    }

    let _tables = request.body.map((item) => ({
      ...item,
      tables: item.tables.map((table) => ({
        ...table,
        is_occupied: list_occupied_tables.includes(table.id) ? true : false,
        reference_id: null,
      }))
    }));

    await sdk.db.table.deleteMany();

    if (_tables && _tables.length > 0) {
      _tables = _tables.map((item) => ({ ...item, table_id: item.id }));

      await sdk.db.table.insertMany(_tables);
    }

    return response.status(200).json({
      message: "Success set_outlet_table",
    });
  } catch (error) {
    console.log("Error set_outlet_table", error);

    return response.status(500).json({
      message: "Error set_outlet_table",
      error: error,
    });
  }
}

async function get_outlet_table(request, response) {
  try {
    const table = await sdk.db.table.find({});

    return response.status(200).json({
      message: "Success get_list_cashier",
      result : table,
    });
  } catch (error) {
    console.log("Error get_outlet_table", error);

    return response.status(500).json({
      message: "Error get_outlet_table",
      error: error,
    });
  }
}

async function get_outlet_sales_type(request, response) {
  try {
    const sales_type = await sdk.db.sales_type.find({}, {});

    return response.status(200).json({
      message: "Success get_list_sales_type",
      result : sales_type,
    });
  } catch (error) {
    console.log("Error get_outlet_sales_type", error);

    return response.status(500).json({
      message: "Error get_outlet_sales_type",
      error: error,
    });
  }
}

async function get_outlet_payment(request, response) {
  try {
    const payment = await sdk.db.payment.find({}, {});

    return response.status(200).json({
      message: "Success get_list_payment",
      result : payment,
    });
  } catch (error) {
    console.log("Error get_outlet_payment", error);

    return response.status(500).json({
      message: "Error get_outlet_payment",
      error: error,
    });
  }
}

async function get_outlet_info(request, response) {
  try {
    const outlet = await sdk.db.outlet.find({ outlet_id: +request.params.outletid }, {});

    return response.status(200).json({
      message: "Success get_outlet_info",
      result : outlet,
    });
  } catch (error) {
    console.log("Error get_outlet_info", error);

    return response.status(500).json({
      message: "Error get_outlet_info",
      error: error,
    });
  }
}

async function get_outlet_banner(request, response) {
  try {
    const banner = await sdk.db.banner.find({}, {});

    return response.status(200).json({
      message: "Success get_outlet_banner",
      result : banner,
    });
  } catch (error) {
    console.log("Error get_outlet_banner", error);

    return response.status(500).json({
      message: "Error get_outlet_banner",
      error: error,
    });
  }
}

async function set_outlet_voucher(request, response) {
  try {
    await sdk.db.voucher.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, voucher_id: item.id }));

      await sdk.db.voucher.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_outlet_voucher",
    });
  } catch (error) {
    console.log("Error set_outlet_voucher", error);

    return response.status(500).json({
      message: "Error set_outlet_voucher",
      error: error,
    });
  }
}

async function get_outlet_voucher(request, response) {
  try {
    const voucher = await sdk.db.voucher.find({}, {});

    return response.status(200).json({
      message: "Success get_outlet_voucher",
      result : voucher,
    });
  } catch (error) {
    console.log("Error get_outlet_voucher", error);

    return response.status(500).json({
      message: "Error get_outlet_voucher",
      error: error,
    });
  }
}



module.exports = {
  set_outlet_banner,
  set_outlet_info,
  set_outlet_payment,
  set_outlet_sales_type,
  set_outlet_table,
  get_outlet_table,
  get_outlet_sales_type,
  get_outlet_payment,
  get_outlet_info,
  get_outlet_banner,
  set_outlet_voucher,
  get_outlet_voucher,
};
