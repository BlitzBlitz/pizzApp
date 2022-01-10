exports.isAuth = (req, res, next) => {
  if (req.session.username == "admin") {
    console.log(req.session.username);
    next();
  } else {
    res.redirect("/admin/login");
  }
};
