const Sequelize = require("sequelize");

const sequelize = new Sequelize("pizzapp", "root", "postgres1", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});
module.exports = sequelize;
