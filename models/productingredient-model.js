const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ProductIngredientModel = sequelize.define("productingredient", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  //   price: {                               //TODO : Add later for financier features to calculate the cost
  //     type: Sequelize.DOUBLE,
  //     allowNull: false,
  //   },
  //   amount: {                                  //TODO: Add it at the join table (product-ingredient)  table
  //     type: Sequelize.DOUBLE,
  //     allowNull: false,
  //   },
});

module.exports = ProductIngredientModel;
