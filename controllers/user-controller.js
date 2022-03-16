const express = require("express");
const { Product } = require("../models/product-model");
const CategoryModel = require("../models/category-model");

exports.getHome = (req, res, next) => {
  let category = req.query.category;
  let product = req.query.product;
  if (!category) {
    category = "pizza";
  }
  CategoryModel.findAll({ order: [["name", "DESC"]] })
    .then((categories) => {
      if (categories) {
        categories = categories.map((category) => {
          return {
            name: category.dataValues.name,
            image: category.dataValues.image,
          };
        });
        return Product.fetchAllByCategory(category, (products) => {
          res.render("user-home", {
            products: products,
            categories: categories,
            category: category,
            product: product,
          });
        });
      } else {
        throw new Error("Category not found");
      }
    })
    .catch((err) => {
      next(err);
    });
  //
};
