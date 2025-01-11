"use strict"

const sdk = require("../../libraries");

async function outlet_info(request, response) {
  try {
    const [outlet] = await sdk.db.outlet.find();

    return response.json({
      status: outlet ? true : false,
      data: outlet || null,
    });
  } catch (error) {
    console.log("[outlet_info].error", error);

    return response.json({
      status: false,
      message: error.message,
    });
  }
}

async function table(request, response) {
  try {
    const table = await sdk.db.table.find();

    return response.json({
      status: true,
      data  : table,
    });
  } catch (error) {
    console.log("[table].error", error);

    return response.json({
      status: false,
      message: error.message,
    });
  }
}

async function product_group(request, response) {
  try {
    const product_group = await sdk.db.product_group.find();

    return response.json({
      status: true,
      data  : product_group || [],
    });
  } catch (error) {
    console.log("[product_group].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function product_category(request, response) {
  try {
    const product_category = await sdk.db.product_category.find();

    return response.json({
      status: true,
      data  : product_category || [],
    });
  } catch (error) {
    console.log("[product_category].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function product_sub_category(request, response) {
  try {
    const product_sub_category = await sdk.db.product_sub_category.find();

    return response.json({
      status: true,
      data  : product_sub_category || [],
    });
  } catch (error) {
    console.log("[product_sub_category].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function list_product(request, response) {
  try {
    const list_product = await sdk.db.product.find();

    return response.json({
      status: true,
      data  : list_product || [],
    });
  } catch (error) {
    console.log("[list_product].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function sales_type(request, response) {
  try {
    const sales_type = await sdk.db.sales_type.findOne({ dine_in: 1 }, {});

    return response.json({
      status: true,
      data  : sales_type || null,
    });
  } catch (error) {
    console.log("[sales_type].error", error);
  }
}

module.exports = {
  outlet_info,
  table,
  product_group,
  product_category,
  product_sub_category,
  list_product,
  sales_type,
};
