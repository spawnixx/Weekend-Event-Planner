import { ExpressError } from "../middleware/expressError.js";
import { Group } from "../models/groupModel.js";
import crypto from "crypto";

export async function getUserGroups(req, res, next) {
  try {
    const userId = req.user.id;
    const groups = await Group.findUserGroups(userId);

    return res.json({ groups });
  } catch (err) {
    next(err);
  }
}

export async function createGroup(req, res, next) {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;
    if (!name) {
      return next(new ExpressError("All fields required", 400));
    }
    const newInvitecode = crypto
      .randomBytes(6)
      .toString("hex")
      .slice(0, 6)
      .toUpperCase();

    const newGroup = await Group.createGroup({
      name,
      ownerId,
      inviteCode: newInvitecode,
    });

    await Group.addMember(newGroup.id, ownerId);

    const inviteLink = `${process.env.FRONTEND_URL}/join/${newInvitecode}`;

    return res.status(201).json({
      group: newGroup,
      inviteCode: newInvitecode,
      inviteLink,
    });
  } catch (err) {
    return next(err);
  }
}

export async function joinByInviteCode(req, res, next) {
  try {
    const userId = req.user.id;
    const groupId = req.group.id;
    console.log(userId, groupId);
    await Group.addMember(groupId, userId);

    return res.status(201).json({
      group: req.group,
    });
  } catch (err) {
    next(err);
  }
}
