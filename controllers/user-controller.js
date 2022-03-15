const express = require("express");
const { Product } = require("../models/product-model");

exports.getHome = (req, res, next) => {
  let category = req.query.category;
  let product = req.query.product;
  if (!category) {
    category = "pizza";
  }
  //
  Product.fetchAllByCategory(category, (products) => {
    console.log(products);
    res.render("user-home", {
      products: products,
      category: category,
      product: products[0],
    });
  }).catch((err) => {
    next(new Error(err));
  });
};
