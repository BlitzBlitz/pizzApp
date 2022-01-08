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
          result = result.dataValues;
          result.ingredients = result.ingredients.map(
            (ingredient) => ingredient.name
          );
        } else {
          result = new Product();
          // result.category = "pizza";
        }
        callback(result);
      })
      .catch((err) => {
        console.log("Fetch One failed\n" + err);
      });
  }
  //TODO
  static addIngredients(savedProduct, ingredients, redirect) {
    let promises = [];
    for (let ingredient of ingredients) {
      let addingPromis = IngredientModel.findOrCreate({
        where: { name: ingredient },
      })
        .then((result) => {
          return savedProduct.addIngredient(result[0], {
            through: ProductIngredientModel,
          });
        })
        .catch((err) => {
          console.log("Error adding ingredients: " + ingredient + err);
        });
      promises.push(addingPromis);
    }
    Promise.all(promises)
      .then((result) => {
        redirect();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //TODO
  static updateProduct(foundProduct, product, redirect) {
    foundProduct.name = product.name;
    foundProduct.price = product.price;
    foundProduct.category = product.category;
    foundProduct.image = product.image;

    let newIngsNames = product.ingredients;

    foundProduct.getIngredients().then((oldIngs) => {
      let oldIngsNames = oldIngs.map(
        (ingredient) => ingredient.dataValues.name
      );
      //Removing old ings
      IngredientModel.findAll({ where: { name: oldIngsNames } })
        .then((foundIngs) => {
          return foundProduct.removeIngredients(foundIngs);
        })
        .then((result) => {
          //Adding new Ones
          this.addIngredients(foundProduct, newIngsNames, redirect);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  static save(product, redirect) {
    product.ingredients = product.ingredients.split(", ");
    let found = 0;
    ProductModel.findByPk(product.id)
      .then((foundProduct) => {
        //if product exist => update
        if (foundProduct != null) {
          found = 1;
          return this.updateProduct(foundProduct, product, redirect);
        } else {
          //if product does not exist => create
          return ProductModel.create(product)
            .then((savedProduct) => {
              return this.addIngredients(
                savedProduct,
                product.ingredients,
                redirect
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .then((result) => {
        if (!found) {
          // redirect();
        }
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
        redirect();
      })
      .catch((err) => {
        console.log("Error deleting product with id: " + productId + err);
      });
  }
};

exports.ProductModel = ProductModel;
