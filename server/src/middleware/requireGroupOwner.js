import { Group } from "../models/groupModel.js";
import { ExpressError } from "./expressError.js";

export default async function requireGroupOwner(req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId, userId);

    if (!group) {
      next(new ExpressError("Group not found", 404));
    }
    if (group.owner_id !== userId) {
      next(new ExpressError("Only the group owner can manage members", 403));
    }
    req.group = group;
    return next();
  } catch (err) {
    return next(err);
  }
}
