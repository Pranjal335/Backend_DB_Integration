const express = require("express");
const router = express.Router();
const {signup, login} = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const {signupSchema, loginSchema}= require("../validators/auth.validator");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/dashboard", authMiddleware, (req, res) => {
    const user = req.session.user;
    res.json({
      message: `Welcome to your dashboard, ${user.email}`,
      user,
    });
  });

module.exports = router;