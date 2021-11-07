const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');

router.get('/about', (req, res, next)=>{
    res.render('about');
});

exports.router = router;