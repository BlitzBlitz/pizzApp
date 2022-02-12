const { Product } = require("../models/product-model");
const fs = require("fs");
const path = require("path");

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

exports.getProfilePicture = (req, res, next) => {
  const username = req.session.username;
  const name = username.split("@")[0]; //should have problems with emails with same name
  const imagePath = path.join(
    __dirname,
    "..",
    "data",
    "profiles",
    name,
    name + ".png"
  );
  //Check if the authenticated user is the one who is trying to access the profile picture
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return next(new Error(err));
    } else {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", "inline; filename=" + name + ".png");
      // res.send(data);
      const file = fs.createReadStream(imagePath);
      file.pipe(res);
    }
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
