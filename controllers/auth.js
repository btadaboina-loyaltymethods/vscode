const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {validationResult} = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Your SMTP server host
  port: 587, // SMTP port (587 for TLS, 465 for SSL)
  secure: false, // true for 465, false for other ports
  auth: {
    user: "tbharatkumar123@gmail.com", // Your Gmail address
    pass: "setyosthrsnsxhtk", // Your Gmail password or App Password
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
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
      req.flash("error", "Invalid email or password.");
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
            const mailOptions = {
              from: "tbharatkumar123@gmail.com",
              to: email,
              subject: "Login completed",
              html: "<h1>Thank you for subscribing to us,Your account ll be debited $50</h1>",
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error("Error sending email:", err);
              } else {
                console.log("Email sent successfully:", info.response);
              }
            });
          });
        }
        req.flash("error", "Invalid password.");

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      req.flash("error", "Already existing user? Try login.");
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
        const mailOptions = {
          from: "tbharatkumar123@gmail.com",
          to: email,
          subject: "Signup completed",
          html: "<h1>Thank you for Signing Up!</h1>",
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
          } else {
            console.log("Email sent successfully:", info.response);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};
exports.postReset = (req, res, user) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);

      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })

      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email");

          res.redirect("/reset");
        }

        user.resetToken = token;

        user.resetTokenExpiration = Date.now() + 3600000;

        return user.save();
      })

      .then((result) => {
        res.redirect("/");

        const mailOptions = {
          from: "tbharatkumar123@gmail.com", // Sender email address

          to: req.body.email, // Recipient email address

          subject: "Password Reset", // Email subject

          text: "Welcome to Your App!", // Plain text body

          html: `<p>Reset</p>

              <p>Click here to reset <a href="http://localhost:3001/reset/${token}">Link</a> to set the password</p>        

        `, // HTML body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);

            res.redirect("/signup");
          }
        });
      })

      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })

    .then((user) => {
      let msg = req.flash("error");

      if (msg.length > 0) {
        msg = msg[0];
      } else {
        msg = null;
      }

      res.render("auth/new-password", {
        path: "/new-password",

        pageTitle: "new password",

        errorMessage: msg,

        userId: user._id.toString(),

        passwordToken: token,
      });
    })

    .catch((err) => {
      console.log(err);
    });
};
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  // console.log(req.body, "hiiiiiiiiiiiiiii");
  const userId = req.body.usedId;
  // console.log(userId, "hello");
  const passwordToken = req.body.passwordToken;

  let resetuser;

  User.findOne({
    _id: userId,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        console.log("User not found");
        // Handle the case where user is not found (e.g., show an error message)
        req.flash("error", "Password reset link is invalid or has expired.");
        return res.redirect("/reset");
      }

      resetuser = user;

      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      if (!resetuser) {
        console.log("User not found");
        // Handle the case where resetuser is not found (e.g., show an error message)
        req.flash("error", "Password reset link is invalid or has expired.");
        return res.redirect("/reset");
      }

      resetuser.password = hashedPassword;
      resetuser.resetToken = undefined;
      resetuser.resetTokenExpiration = undefined;

      return resetuser.save();
    })
    .then((result) => {
      // Password reset successful, redirect to login
      req.flash(
        "success",
        "Password reset successful. You can now login with your new password."
      );
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      // Handle other errors
      req.flash("error", "An error occurred while resetting the password.");
      return res.redirect("/reset");
    });
};

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
