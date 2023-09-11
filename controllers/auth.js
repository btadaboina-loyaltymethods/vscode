const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1] === "true";
  // console.log(req.get("Cookie").split("=")[1]);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
  // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly ");
  // req.isLoggedIn = true;
};
exports.postLogin = (req, res, next) => {
  User.findById("64fbfb16f4944c5e8b37b2c9").then((user) => {
    // console.log("hi", user);
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect("/");
  });
};
