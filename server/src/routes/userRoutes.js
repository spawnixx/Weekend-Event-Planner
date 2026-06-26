const express = require("express");
const router = new express.Router();
const ExpressError = require("../middleware/expressError");
const User = require("../models/userModel");
const {
  register,
  login,
  updateProfile,
} = require("../controllers/authController");
const tokenAuth = require("../middleware/tokenAuth");
router.post("/register", register);
router.post("/login", login);
router.get("/profile", tokenAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ExpressError("User not found", 404));
    }
    res.json(user);
  } catch (err) {
    next(new ExpressError("Server error", 500));
  }
});
router.patch("/profile", tokenAuth, updateProfile);
module.exports = router;
