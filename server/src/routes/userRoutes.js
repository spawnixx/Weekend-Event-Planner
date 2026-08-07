import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
  getProfile,
} from "../controllers/authController.js";
import { tokenAuth } from "../middleware/tokenAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", tokenAuth, getProfile);
router.patch("/profile", tokenAuth, updateProfile);
export { router };
