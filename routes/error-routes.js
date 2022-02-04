const express = require("express");
const router = express.Router();
const errorController = require("../controllers/error-controller");

router.get("/500", errorController.get500);

exports.router = router;
