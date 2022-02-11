const { Product } = require("../models/product-model");

exports.getProducts = (req, res, next) => {
  const category = req.params["category"];

  Product.fetchAll((products) => {
    res.render("admin", {
      products: products,
      category: category,
      username: req.session.username,
    });
  }).catch((err) => {
    next(new Error(err));
  });
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
  let product = { ...req.body };
  delete product._csrf;
  product.image = req.file.path;
  console.log(product);
  if (req.body.id == 0) {
    product.id = 0;
    product.category = req.params.category;
  }
  Product.save(product, () => {
    res.redirect("/admin/products/pizza");
  });
};

exports.deleteProduct = (req, res, next) => {
  let productId = req.params.productId;
  Product.delete(productId, () => {
    res.redirect("/admin/products/pizza");
  });
};
