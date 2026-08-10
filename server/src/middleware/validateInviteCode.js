import { Group } from "../models/groupModel.js";
import { ExpressError } from "./expressError.js";

export async function validateInviteCode(req, res, next) {
  try {
    const userId = req.user.id;
    const inviteCode = req.body?.inviteCode || req.params.inviteCode;
    console.log(req.body);
    if (!inviteCode) {
      return next(new ExpressError("Invite code required", 400));
    }
    const existingGroup = await Group.findByInviteCode(inviteCode);
    if (!existingGroup) {
      return next(new ExpressError("Invalid invite code. Try Again", 404));
    }
    console.log(existingGroup.name);
    const isMember = await Group.memberCheck(existingGroup.id, userId);
    if (isMember) {
      return next(new ExpressError("Already in this group", 409));
    }
    req.group = existingGroup;
    next();
  } catch (err) {
    next(err);
  }
}
