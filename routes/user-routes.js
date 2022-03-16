const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("", userController.getHome);

exports.router = router;
