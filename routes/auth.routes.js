const express = require("express");
const router = express.Router();
const {signup, login, logout} = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const {signupSchema, loginSchema}= require("../validators/auth.validator");
const authMiddleware = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/auth");


router.post("/logout", verifyToken, logout);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.get("/dashboard", verifyToken, (req, res) => {
    //const user = req.session.user;
    res.json({
      message: `Welcome to your dashboard, ${req.user.email}`,
      user: req.user,
    });
  });

module.exports = router;