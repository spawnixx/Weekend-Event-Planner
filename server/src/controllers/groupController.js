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

export async function getGroup(req, res, next) {
  try {
    const { id } = req.params;
    const group = await Group.findById(id, req.user.id);

    if (!group) {
      return next(new ExpressError("Group not found", 404));
    }
    return res.json({ group });
  } catch (err) {
    next(err);
  }
}

export async function getInvitePreview(req, res, next) {
  try {
    const { inviteCode } = req.params;
    const group = await Group.findByInviteCode(inviteCode);

    if (!group) {
      return next(new ExpressError("Invalid invite link", 404));
    }
    return res.json({
      group: {
        id: group.id,
        name: group.name,
      },
    });
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

export async function getGroupMembers(req, res, next) {
  try {
    const members = await Group.getMembers(req.params.groupId);
    return res.json({ members });
  } catch (err) {
    return next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const removedMember = await Group.removeMember(
      req.params.groupId,
      req.params.userId,
    );
    return res.json({
      message: "Member removed",
      userId: removedMember.user_id,
    });
  } catch (err) {
    return next(err);
  }
}
