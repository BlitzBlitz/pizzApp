const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const CategoryModel = sequelize.define("category", {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = CategoryModel;
