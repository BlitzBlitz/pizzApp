const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const auth = require("../controllers/auth-controller");

router.get("/login", auth.getLogin);
router.post("/login", auth.postLogin);
router.get("/logout", auth.getLogout);
router.post("/signup", auth.postSignup);

router.get("/products/:category", auth.isAuth, adminController.getProducts);
router.get(
  "/products/:category/:productId/edit",
  auth.isAuth,
  adminController.getProduct
);
router.post(
  "/products/:category/:productId/edit",
  auth.isAuth,
  adminController.editProduct
);
router.post(
  "/products/:category/:productId/delete",
  auth.isAuth,
  adminController.deleteProduct
);

exports.router = router;
