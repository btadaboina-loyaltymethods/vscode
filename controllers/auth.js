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
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  });
};
exports.postSignup = (req, res, next) => {};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

// const User = require('../models/user');

// exports.getLogin = (req, res, next) => {
//   res.render('auth/login', {
//     path: '/login',
//     pageTitle: 'Login',
//     isAuthenticated: false
//   });
// };

// exports.getSignup = (req, res, next) => {
//   res.render('auth/signup', {
//     path: '/signup',
//     pageTitle: 'Signup',
//     isAuthenticated: false
//   });
// };

// exports.postLogin = (req, res, next) => {
//   User.findById('5bab316ce0a7c75f783cb8a8')
//     .then(user => {
//       req.session.isLoggedIn = true;
//       req.session.user = user;
//       req.session.save(err => {
//         console.log(err);
//         res.redirect('/');
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postSignup = (req, res, next) => {};

// exports.postLogout = (req, res, next) => {
//   req.session.destroy(err => {
//     console.log(err);
//     res.redirect('/');
//   });
// };
