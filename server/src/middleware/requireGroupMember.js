import { Group } from "../models/groupModel.js";
import { ExpressError } from "./expressError.js";

export default async function requireGroupMember(req, res, next) {
  try {
    const groupId = req.params.groupId ?? req.params.id;
    const userId = req.user.id;
    const isMember = await Group.memberCheck(groupId, userId);
    if (!isMember) {
      return next(new ExpressError("Group not found", 404));
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
