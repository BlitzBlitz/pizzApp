const express = require("express");
var bodyParser = require("body-parser");
const productRoutes = require("./routes/product-routes");
const aboutRoutes = require("./routes/about-routes");
const adminRoutes = require("./routes/admin-routes");
const path = require("path");
const favicon = require("serve-favicon");

const app = express();
const server = app.listen(3000);

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
