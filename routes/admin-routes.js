const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

router.get("/products/:category", adminController.getProducts);
router.get("/products/:category/:productId/edit", adminController.getProduct);
router.post("/products/:category/:productId/edit", adminController.editProduct);
router.post(
  "/products/:category/:productId/delete",
  adminController.deleteProduct
);

exports.router = router;
