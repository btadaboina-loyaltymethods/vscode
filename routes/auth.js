const express = require("express");
// const { csrfProtection } = require("../app");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
