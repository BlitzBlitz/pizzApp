const express = require("express");

exports.get500 = (req, res, next) => {
  res.render("500", {
    error: "Something went wrong",
  });
};
