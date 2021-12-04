const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const IngredientModel = require("./ingredient-model");
const ProductIngredientModel = require("./productingredient-model");

const ProductModel = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

exports.Product = class Product {
  constructor(id, category, name, ingredients, price, image) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.ingredients = ingredients;
    this.price = price;
    this.image = image;
  }

  static fetchAll(callback) {
    ProductModel.findAll({ include: IngredientModel })
      .then((results) => {
        console.log(results);

        const products = []; //TODO
        callback(products);
      })
      .catch((err) => {
        console.log("Fetch All failed" + err);
      });
  }
  static fetchOne(productId, callback) {
    ProductModel.findByPk(productId)
      .then((result) => {
        if (result) {
          result.ingredients = ["Cheese", "Sauce"];
        } else {
          result = new Product();
        }
        callback(result);
      })
      .catch((err) => {
        console.log("Fetch One failed\n" + err);
      });
  }

  static addIngredients(savedProduct, ingredients) {
    IngredientModel.findOrCreate({
      where: { name: ingredients[0] },
    }).then((result) => {
      savedProduct.addIngredient(result[0], {
        through: ProductIngredientModel,
      });
    });
  }

  static updateProduct(foundProduct, product) {
    foundProduct.name = product.name;
    foundProduct.price = product.price;
    foundProduct.category = product.category;
    foundProduct.image = product.image;
    return foundProduct.save();
  }

  static save(product, redirect) {
    product.ingredients = product.ingredients.split(", ");

    ProductModel.findByPk(product.id)
      .then((foundProduct) => {
        console.log(foundProduct);

        //if product exist => update
        if (foundProduct != null) {
          return this.updateProduct(foundProduct, product);
        } else {
          //if product does not exist => create
          return ProductModel.create(product)
            .then((savedProduct) => {
              this.addIngredients(savedProduct, product.ingredients);
            })
            .catch((err) => {
              console.log("Error saving: " + product + err);
            });
        }
      })
      .then((result) => {
        redirect();
        console.log("Succesfully saved: " + product);
      })
      .catch((err) => {
        console.log("Error saving: " + product + err);
      });
  }

  static delete(productId, redirect) {
    ProductModel.findByPk(productId)
      .then((product) => {
        return product.destroy();
      })
      .then((result) => {
        console.log(result);
        redirect();
      })
      .catch((err) => {
        console.log("Error deleting product with id: " + productId + err);
      });
  }
};

exports.ProductModel = ProductModel;
