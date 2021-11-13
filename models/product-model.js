const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const dataPath = path.join(
  path.dirname(__dirname),
  "data",
  "product-data.json"
);

const Product = sequelize.define("product", {
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

module.exports = class Product {
  constructor(id, category, name, ingredients, price) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.ingredients = ingredients;
    this.price = price;
  }

  static fetchAll(callback) {
    fs.readFile(dataPath, (err, fileContent) => {
      if (err) {
        callback([]);
      } else {
        callback(JSON.parse(fileContent));
      }
    });
  }
  static fetchOne(productId, callback) {
    fs.readFile(dataPath, (err, fileContent) => {
      if (err) {
        callback();
      } else {
        const products = JSON.parse(fileContent);
        for (let product of products) {
          if (product.id == productId) {
            console.log(product);
            return callback(product);
          }
        }
        return callback({});
      }
    });
  }

  static save(product) {
    Product.fetchAll((products) => {
      let index = products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        products[index] = product;
      } else {
        products.push(product);
      }
      fs.writeFile(dataPath, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
  }
  static delete(productId) {
    Product.fetchAll((products) => {
      products = products.filter((p) => p.id != productId);
      fs.writeFile(dataPath, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
  }
};