const { UserModel } = require("../models/user-model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.isAuth = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

exports.getLogin = (req, res, next) => {
  res.render("admin-login", { error: "", message: "" });
};
exports.postLogin = (req, res, next) => {
  UserModel.findOne({ where: { username: req.body.username } }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          req.session.username = user.username;
          req.session.save((err) => {
            // if db is slow or not working
            if (err) {
              console.log(err);
              res.redirect("/admin/login");
            }
            res.redirect("/admin/products/pizza");
          });
        } else {
          res.status(401).render("admin-login", {
            error: "Invalid username or password",
            message: "",
          });
        }
      });
    } else {
      if (!validationResult(req).isEmpty()) {
        res.status(422).render("admin-login", {
          error: validationResult(req).array()[0].msg,
        });
      } else {
        res.status(401).render("admin-login", {
          error: "Invalid username or password",
          message: "",
        });
      }
    }
  });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/admin/login");
  });
};

exports.postSignup = (req, res, next) => {
  UserModel.findOne({ where: { username: req.body.username } }).then((user) => {
    if (user) {
      res.redirect("/admin/login");
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        UserModel.create({
          username: req.body.username,
          password: hash,
        }).then((user) => {
          res.render("admin-login", {
            error: "",
            message: "User created successfully",
          });
        });
      });
    }
  });
};
