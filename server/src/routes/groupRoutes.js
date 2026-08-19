import express from "express";
import { tokenAuth } from "../middleware/tokenAuth.js";
import {
  createGroup,
  getUserGroups,
  joinByInviteCode,
  getGroup,
  getGroupMembers,
  getInvitePreview,
  removeMember,
  deleteGroup,
} from "../controllers/groupController.js";
import {
  createEvent,
  getGroupEvents,
  voteEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { validateInviteCode } from "../middleware/validateInviteCode.js";
import validateEvent from "../middleware/validateEvent.js";
import validateEventUpdate from "../middleware/validateEventUpdate.js";
import requireGroupOwner from "../middleware/requireGroupOwner.js";
import requireGroupMember from "../middleware/requireGroupMember.js";

const router = express.Router();

router.get("/", tokenAuth, getUserGroups);
router.get("/invite/:inviteCode", getInvitePreview);
router.get("/:id/events", tokenAuth, requireGroupMember, getGroupEvents);
router.get("/:id/members", tokenAuth, requireGroupMember, getGroupMembers);
router.get("/:id", tokenAuth, getGroup);

router.post("/create", tokenAuth, createGroup);
router.post("/join", tokenAuth, validateInviteCode, joinByInviteCode);
router.post(
  "/invite/:inviteCode",
  tokenAuth,
  validateInviteCode,
  joinByInviteCode,
);
router.post(
  "/:id/events",
  tokenAuth,
  requireGroupMember,
  validateEvent,
  createEvent,
);
router.post(
  "/:groupId/events/:eventId/vote",
  tokenAuth,
  requireGroupMember,
  voteEvent,
);

router.patch(
  "/:groupId/events/:eventId",
  tokenAuth,
  requireGroupOwner,
  validateEventUpdate,
  updateEvent,
);

router.delete("/:groupId/members/:userId", tokenAuth, removeMember);
router.delete(
  "/:groupId/events/:eventId",
  tokenAuth,
  requireGroupOwner,
  deleteEvent,
);
router.delete("/:groupId", tokenAuth, requireGroupOwner, deleteGroup);
export { router };
