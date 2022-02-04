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

  //ToDo return promises to catch error in controller

  static fetchAll(callback) {
    return ProductModel.findAll({ include: IngredientModel }).then(
      (results) => {
        results = results.map((element) => {
          element.dataValues.ingredients = element.dataValues.ingredients.map(
            (ingredient) => ingredient.name
          );
          return element.dataValues;
        });
        // throw new Error("My 1Error");
        callback(results);
      }
    );
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

  static addIngredients(savedProduct, ingredients, redirect) {
    let promises = [];
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
    return Promise.all(promises).then((result) => {
      return savedProduct.save().then(() => {
        redirect();
      });
    });
  }

  static updateProduct(foundProduct, product, redirect) {
    foundProduct.name = product.name;
    foundProduct.price = product.price;
    foundProduct.category = product.category;
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
          this.addIngredients(foundProduct, newIngsNames, redirect);
        });
    });
  }

  static save(product, redirect) {
    product.ingredients = product.ingredients.split(", ");
    let found = 0;
    return ProductModel.findByPk(product.id).then((foundProduct) => {
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
    });
  }

  static delete(productId, redirect) {
    return ProductModel.findByPk(productId)
      .then((product) => {
        return product.destroy();
      })
      .then((result) => {
        redirect();
      });
  }
};

exports.ProductModel = ProductModel;
