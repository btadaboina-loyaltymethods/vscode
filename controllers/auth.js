const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1] === "true";
  // console.log(req.get("Cookie").split("=")[1]);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
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
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or pasword.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            res.redirect("/");
          });
        }
        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
    // console.log("hi", user);
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect("/signup");
    }
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
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
