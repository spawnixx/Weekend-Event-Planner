import express from "express";
import { tokenAuth } from "../middleware/tokenAuth.js";
import { createGroup } from "../controllers/groupController.js";

const router = express.Router();

router.get("/", tokenAuth);
router.get("/:id", tokenAuth);

router.post("/create", tokenAuth, createGroup);
// router.post("/:id/join", tokenAuth, join);

export { router };
