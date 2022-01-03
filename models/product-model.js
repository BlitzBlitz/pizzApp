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
        results = results.map((element) => {
          element.dataValues.ingredients = element.dataValues.ingredients.map(
            (ingredient) => ingredient.name
          );
          return element.dataValues;
        });
        callback(results);
      })
      .catch((err) => {
        console.log("Fetch All failed" + err);
      });
  }
  static fetchOne(productId, callback) {
    ProductModel.findByPk(productId, { include: IngredientModel })
      .then((result) => {
        if (result) {
          result.dataValues.ingredients = result.dataValues.ingredients.map(
            (ingredient) => {
              return ingredient.name;
            }
          );
        } else {
          result = new Product();
        }
        callback(result.dataValues);
      })
      .catch((err) => {
        console.log("Fetch One failed\n" + err);
      });
  }

  static addIngredients(savedProduct, ingredients) {
    for (let ingredient of ingredients) {
      IngredientModel.findOrCreate({
        where: { name: ingredient },
      })
        .then((result) => {
          return savedProduct.addIngredient(result[0], {
            through: ProductIngredientModel,
          });
        })
        .catch((err) => {
          // console.log("Error adding ingredients: " + product + err);
        });
    }
  }

  static updateProduct(foundProduct, product) {
    foundProduct.name = product.name;
    foundProduct.price = product.price;
    foundProduct.category = product.category;
    foundProduct.image = product.image;
    //TODO: Updating ingredients

    let newIngs = product.ingredients;
    foundProduct.getIngredients().then((oldIngs) => {
      console.log(oldIngs);

      oldIngs.forEach((oldIngredient) => {
        console.log(oldIngredient.dataValues.name);

        // let newIngIndex = newIngs.indexOf(oldIngredient.dataValues.name);
        // if (newIngIndex == -1) {
        //   oldIngs.splice(newIngIndex, 1);
        // }
      });
    });
  }

  static save(product, redirect) {
    product.ingredients = product.ingredients.split(", ");

    ProductModel.findByPk(product.id)
      .then((foundProduct) => {
        //if product exist => update
        if (foundProduct != null) {
          return this.updateProduct(foundProduct, product);
        } else {
          //if product does not exist => create
          return ProductModel.create(product)
            .then((savedProduct) => {
              return this.addIngredients(savedProduct, product.ingredients);
            })
            .catch((err) => {
              // console.log("Error saving: " + product + err);
            });
        }
      })
      .then((result) => {
        redirect();
        // console.log("Succesfully saved: " + product);
      })
      .catch((err) => {
        // console.log("Error saving: " + product + err);
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
