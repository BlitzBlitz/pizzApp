const express = require("express");
const router = express.Router();
const Product = require("../models/product-model");

exports.getProducts = (req, res, next) => {
  const category = req.params["category"];

  Product.fetchAll(() => {});

  // Product.fetchAll((products) => {
  //   res.render("admin", {
  //     products: products,
  //     category: category,
  //   });
  // });
};

exports.getProduct = (req, res, next) => {
  let productId = req.params["productId"];
  let newItem = req.query.newItem;

  Product.fetchOne(productId, (product) => {
    res.render("admin-edit-product", {
      product: product,
      newItem: req.query.newItem == "true",
    });
  });
};

exports.editProduct = (req, res, next) => {
  if (req.body.id == 0) {
    req.body.id = 0;
    req.body.category = req.params.category;
  }
  Product.save(req.body, () => {
    res.redirect("/admin/products/pizza");
  });
};

exports.deleteProduct = (req, res, next) => {
  let productId = req.params.productId;
  Product.delete(productId, () => {
    res.redirect("/admin/products/pizza");
  });
};
