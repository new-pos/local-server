"use strict"

const cashier = require("./structures/cashier");
const banner  = require("./structures/banner");
const outlet  = require("./structures/outlet");
const payment = require("./structures/payment");
const sales_type = require("./structures/sales-type");
const table = require("./structures/table");
const product_category = require("./structures/product-category");
const product_group = require("./structures/product-group");
const product_sub_category = require("./structures/product-sub-category");
const product = require("./structures/product");

module.exports = {
  cashier,
  banner,
  outlet,
  payment,
  sales_type,
  table,
  product_category,
  product_group,
  product_sub_category,
  product,
};
