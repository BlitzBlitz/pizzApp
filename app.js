const express = require("express");
var bodyParser = require("body-parser");
const productRoutes = require("./routes/product-routes");
const aboutRoutes = require("./routes/about-routes");
const adminRoutes = require("./routes/admin-routes");
const path = require("path");
const favicon = require("serve-favicon");
const sequelize = require("./util/database");
const { ProductModel } = require("./models/product-model");
const IngredientModel = require("./models/ingredient-model");
const ProductIngredientModel = require("./models/productingredient-model");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public"), { redirect: true }));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use("/product", productRoutes.router);
app.use("/about", aboutRoutes.router);
app.use("/admin", adminRoutes.router);

ProductModel.belongsToMany(IngredientModel, {
  through: ProductIngredientModel,
});
IngredientModel.belongsToMany(ProductModel, {
  through: ProductIngredientModel,
  onDelete: "cascade",
  onUpdate: "cascade",
});

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    const server = app.listen(3000);
  })
  .catch((err) => {
    console.log("Could not connect to DB" + err);
  });
