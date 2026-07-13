import express from "express";
import { tokenAuth } from "../middleware/tokenAuth.js";
import {
  createGroup,
  getUserGroups,
  joinByInviteCode,
  getGroup,
  getInvitePreview,
} from "../controllers/groupController.js";
import {
  createEvent,
  getGroupEvents,
  voteEvent,
} from "../controllers/eventController.js";
import { validateInviteCode } from "../middleware/validateInviteCode.js";

const router = express.Router();

router.get("/", tokenAuth, getUserGroups);
router.get("/invite/:inviteCode", getInvitePreview);
router.get("/:id/events", tokenAuth, getGroupEvents);
router.get("/:id", tokenAuth, getGroup);

router.post("/create", tokenAuth, createGroup);
router.post("/join", tokenAuth, validateInviteCode, joinByInviteCode);
router.post(
  "/invite/:inviteCode",
  tokenAuth,
  validateInviteCode,
  joinByInviteCode,
);
router.post("/:id/events", tokenAuth, createEvent);
router.post("/:groupId/events/:eventId/vote", tokenAuth, voteEvent);

export { router };
