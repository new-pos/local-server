"use strict"

const sdk = require("../../libraries");

async function get_product(request, response) {
  try {
    const product = await sdk.db.product.find({ }, {});

    return response.status(200).json({
      message: "Success get_product",
      result : product,
    });
  } catch (error) {
    console.log("Error get_product", error);

    return response.status(500).json({
      message: "Error get_product",
      error: error,
    });
  }
}

async function get_product_group(request, response) {
  try {
    const product_group = await sdk.db.product_group.find({ }, {});

    return response.status(200).json({
      message: "Success get_product_group",
      result : product_group,
    });
  } catch (error) {
    console.log("Error get_product_group", error);

    return response.status(500).json({
      message: "Error get_product_group",
      error: error,
    });
  }
}

async function get_product_category(request, response) {
  try {
    const product_category = await sdk.db.product_category.find({ }, {});

    return response.status(200).json({
      message: "Success get_product_category",
      result : product_category,
    });
  } catch (error) {
    console.log("Error get_product_category", error);

    return response.status(500).json({
      message: "Error get_product_category",
      error: error,
    });
  }
}

async function get_product_sub_category(request, response) {
  try {
    const product_sub_category = await sdk.db.product_sub_category.find({ }, {});

    return response.status(200).json({
      message: "Success get_product_sub_category",
      result : product_sub_category,
    });
  } catch (error) {
    console.log("Error get_product_sub_category", error);

    return response.status(500).json({
      message: "Error get_product_sub_category",
      error: error,
    });
  }
}

async function set_product(request, response) {
  try {
    await sdk.db.product.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, product_id: item.id }));

      await sdk.db.product.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_product",
    });
  } catch (error) {
    console.log("Error set_product", error);

    return response.status(500).json({
      message: "Error set_product",
      error: error,
    });
  }
}

async function set_product_group(request, response) {
  try {
    await sdk.db.product_group.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, product_group_id: item.id }));

      await sdk.db.product_group.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_product_group",
    });
  } catch (error) {
    console.log("Error set_product_group", error);

    return response.status(500).json({
      message: "Error set_product_group",
      error: error,
    });
  }
}

async function set_product_category(request, response) {
  try {
    await sdk.db.product_category.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, product_category_id: item.id }));

      await sdk.db.product_category.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_product_category",
    });
  } catch (error) {
    console.log("Error set_product_category", error);

    return response.status(500).json({
      message: "Error set_product_category",
      error: error,
    });
  }
}

async function set_product_sub_category(request, response) {
  try {
    await sdk.db.product_sub_category.deleteMany();

    if (request.body && request.body.length > 0) {
      request.body = request.body.map((item) => ({ ...item, product_sub_category_id: item.id }));

      await sdk.db.product_sub_category.insertMany(request.body);
    }

    return response.status(200).json({
      message: "Success set_product_sub_category",
    });
  } catch (error) {
    console.log("Error set_product_sub_category", error);

    return response.status(500).json({
      message: "Error set_product_sub_category",
      error: error,
    });
  }
}

module.exports = {
  get_product,
  get_product_group,
  get_product_category,
  get_product_sub_category,
  set_product,
  set_product_group,
  set_product_category,
  set_product_sub_category,
};
