const express = require("express");
const router = express.Router();
const { Product } = require("../models/product-model");

exports.getProduct = (req, res, next) => {
  Product.fetchOne("1", (product) => {
    // TODO
    res.render("index", {
      product: product,
    });
  });
};
