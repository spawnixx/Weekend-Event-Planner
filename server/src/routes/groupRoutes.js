import express from "express";
import { tokenAuth } from "../middleware/tokenAuth.js";
import {
  createGroup,
  getUserGroups,
  joinByInviteCode,
} from "../controllers/groupController.js";
import { validateInviteCode } from "../middleware/validateInviteCode.js";

const router = express.Router();

router.get("/", tokenAuth, getUserGroups);
router.get("/:id", tokenAuth);

router.post("/create", tokenAuth, createGroup);
router.post("/join", tokenAuth, validateInviteCode, joinByInviteCode);
router.post("/join/:inviteCode", tokenAuth, joinByInviteCode);

export { router };
