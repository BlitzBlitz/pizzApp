const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const productRoutes = require("./routes/product-routes");
const aboutRoutes = require("./routes/about-routes");
const adminRoutes = require("./routes/admin-routes");
const errorRoutes = require("./routes/error-routes");
const path = require("path");
const favicon = require("serve-favicon");
const sequelize = require("./util/database");
const { ProductModel } = require("./models/product-model");
const IngredientModel = require("./models/ingredient-model");
const ProductIngredientModel = require("./models/productingredient-model");
const session = require("express-session");
const csfr = require("csurf");
const { log } = require("console");

const app = express();

//SESSION
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.use(
  session({
    secret: "mine-secret",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({ db: sequelize }),
  })
);

//VIEW ENGINE
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

//File Handling

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
app.use(multer({ storage: fileStorage }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

//CSFR
app.use(csfr());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

//ROUTES
app.use("/product", productRoutes.router);
app.use("/about", aboutRoutes.router);
app.use("/admin", adminRoutes.router);
app.use(errorRoutes.router);

//WRONG TURN
app.use("*", (req, res, next) => {
  res.redirect("/admin/login");
});

//ERROR HANDLER
app.use((error, req, res, next) => {
  res.redirect("/500");
  console.log(error);
});

//Models
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
