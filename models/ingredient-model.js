const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const IngredientModel = sequelize.define("ingredient", {
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
  //   price: {                               //TODO : Add later for financier features to calculate the cost
  //     type: Sequelize.DOUBLE,
  //     allowNull: false,
  //   },
  //   amount: {
  //     type: Sequelize.DOUBLE,
  //     allowNull: false,
  //   },
});

module.exports = IngredientModel;
