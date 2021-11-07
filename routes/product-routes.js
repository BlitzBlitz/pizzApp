const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');

router.get('/', productController.getProduct);


exports.router = router;