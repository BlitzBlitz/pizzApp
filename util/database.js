const Sequelize = require("sequelize");

const sequelize = new Sequelize("pizzapp", "root", "mysql2020", {
  dialect: "mysql",
  host: "localhost",
  logging: true,
});
module.exports = sequelize;
