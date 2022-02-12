const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const auth = require("../controllers/auth-controller");
const { check } = require("express-validator");

router.get("/login", auth.getLogin);
router.post(
  "/login",
  check("username").isEmail().withMessage("Enter a valid email"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  auth.postLogin
);
router.get("/logout", auth.getLogout);
router.post("/signup", auth.postSignup);

router.get("/products/:category", auth.isAuth, adminController.getProducts);
router.get(
  "/products/:category/:productId/edit",
  auth.isAuth,
  adminController.getProduct
);
router.get("/profile-picture", auth.isAuth, adminController.getProfilePicture);
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
