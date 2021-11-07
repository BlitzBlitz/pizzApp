const express = require("express");
const router = express.Router();
const Product = require("../models/product-model");

exports.getProducts = (req, res, next) => {
  const category = req.params["category"];

  Product.fetchAll((products) => {
    res.render("admin", {
      products: products,
      category: category,
    });
  });
};

exports.getProduct = (req, res, next) => {
  let productId = req.params["productId"];
  let newItem = req.query.newItem;

  console.log(req.query.newItem == "true");
  console.log(productId);

  Product.fetchOne(productId, (product) => {
    console.log(product);

    res.render("admin-edit-product", {
      product: product,
      newItem: req.query.newItem == "true",
    });
  });
};

exports.editProduct = (req, res, next) => {
  if (req.body.id == 0) {
    req.body.id = Math.random().toString();
    req.body.category = req.params.category;
  }
  Product.save(req.body);
  res.redirect("/admin/products/pizza");
};

exports.deleteProduct = (req, res, next) => {
  let productId = req.params.productId;
  Product.delete(productId);
  res.redirect("/admin/products/pizza");
};
