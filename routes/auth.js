const express = require("express");
// const { csrfProtection } = require("../app");
const { check, body } = require("express-validator");

// console.log(ep.check, "k8tgyhunjmiljgds");

const authController = require("../controllers/auth");
// const { check } = require("express-validator");

const router = express.Router();
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email").isEmail(),
    // console.log(ev.body()),
    body("password", "Please enter a valid email or password")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post("/login", authController.postLogin);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);
module.exports = router;
