const express = require("express");
const router = express.Router();
const { Product } = require("../models/product-model");

exports.getLogin = (req, res, next) => {
  res.render("admin-login");
};
exports.postLogin = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  //TODO connect to DB and check if username and password are correct
  if (username == "admin") {
    req.session.username = username;
    res.redirect("/admin/products/pizza");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getProducts = (req, res, next) => {
  const category = req.params["category"];
  if (req.session.username == "admin") {
    Product.fetchAll((products) => {
      res.render("admin", {
        products: products,
        category: category,
      });
    });
  } else {
    res.redirect("/admin/login");
  }
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
