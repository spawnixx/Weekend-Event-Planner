const express = require("express");
const router = new express.Router();

const {
  register,
  login,
  editProfile,
} = require("../controllers/authController");
const tokenAuth = require("../middleware/tokenAuth");
router.post("/register", register);
router.post("/login", login);
router.get("/profile", tokenAuth, (req, res) => {
  res.json(req.user);
});
router.patch("/profile", editProfile);
module.exports = router;
