const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const IngredientModel = require("./ingredient-model");
const ProductIngredientModel = require("./productingredient-model");
const fs = require("fs");
const path = require("path");
const CategoryModel = require("./category-model");

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
    return ProductModel.findAll({ include: IngredientModel }).then(
      (results) => {
        results = results.map((element) => {
          element.dataValues.ingredients = element.dataValues.ingredients.map(
            (ingredient) => ingredient.name
          );
          return element.dataValues;
        });
        callback(results);
      }
    );
  }

  static fetchAllByCategory(category, callback) {
    return ProductModel.findAll({
      where: { categoryName: category },
      include: IngredientModel,
    }).then((results) => {
      results = results.map((element) => {
        element.dataValues.ingredients = element.dataValues.ingredients.map(
          (ingredient) => ingredient.name
        );
        return element.dataValues;
      });
      callback(results);
    });
  }

  static fetchOne(productId, callback) {
    return ProductModel.findByPk(productId, { include: IngredientModel }).then(
      (result) => {
        if (result) {
          result = result.dataValues;
          result.ingredients = result.ingredients.map(
            (ingredient) => ingredient.name
          );
        } else {
          result = new Product();
        }
        callback(result);
      }
    );
  }

  static addIngredients(savedProduct, ingredients) {
    let promises = [];
    console.log(ingredients);
    for (let ingredient of ingredients) {
      let addingPromis = IngredientModel.findOrCreate({
        where: { name: ingredient },
      }).then((result) => {
        return savedProduct.addIngredient(result[0], {
          through: ProductIngredientModel,
        });
      });
      promises.push(addingPromis);
    }
    return Promise.all(promises).then(() => {
      return savedProduct.save();
    });
  }

  static updateProduct(foundProduct, product, redirect) {
    fs.unlink(path.join(__dirname, "..", foundProduct.image), (err) => {
      if (err) {
        console.log(err);
      }
    });
    foundProduct.name = product.name;
    foundProduct.price = product.price;
    foundProduct.image = product.image;

    let newIngsNames = product.ingredients;
    return foundProduct.getIngredients().then((oldIngs) => {
      let oldIngsNames = oldIngs.map(
        (ingredient) => ingredient.dataValues.name
      );
      //Removing old ings
      return IngredientModel.findAll({ where: { name: oldIngsNames } })
        .then((foundIngs) => {
          return foundProduct.removeIngredients(foundIngs);
        })
        .then((result) => {
          //Adding new Ones
          this.addIngredients(foundProduct, newIngsNames).then(() => {
            return foundProduct.save().then(() => {
              redirect();
            });
          });
        });
    });
  }

  static save(product, redirect) {
    product.ingredients = product.ingredients.split(", ");
    let found = 0;
    return ProductModel.findByPk(product.id).then((foundProduct) => {
      if (foundProduct != null) {
        found = 1;
        return this.updateProduct(foundProduct, product, redirect);
      } else {
        return CategoryModel.findByPk(product.category).then((category) => {
          if (category) {
            let buildedProduct = ProductModel.build(product);
            buildedProduct.setCategory(category);
            return buildedProduct.save().then(() => {
              this.addIngredients(buildedProduct, product.ingredients).then(
                () => {
                  redirect();
                }
              );
            });
          } else {
            throw "Category not found";
          }
        });
      }
    });
  }
  static delete(productId, redirect) {
    return ProductModel.findByPk(productId)
      .then((product) => {
        fs.unlink(path.join(__dirname, "..", product.image), (err) => {
          if (err) {
            console.log(err);
          }
        });
        return product.destroy();
      })
      .then((result) => {
        redirect();
      });
  }
};

exports.ProductModel = ProductModel;
