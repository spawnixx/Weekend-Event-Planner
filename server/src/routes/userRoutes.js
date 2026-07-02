import express from "express";
import { ExpressError } from "../middleware/expressError.js";
import { User } from "../models/userModel.js";
import {
  register,
  login,
  updateProfile,
} from "../controllers/authController.js";
import { tokenAuth } from "../middleware/tokenAuth.js";

const router = express.Router();

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
export { router };
