const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const auth = require("../controllers/auth");

router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);
router.get("/logout", adminController.getLogout);

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
