const ExpressError = require("../middleware/expressError");
const Group = require("../models/groupModel");
const crypto = require("crypto");

async function create(req, res, next) {
  try {
    const { name, ownerId } = req.body;
    if (!name || !ownerId) {
      next(new ExpressError("All fields required", 400));
    }
    const newInvitecode = crypto
      .randomBytes(6)
      .toString("hex")
      .slice(0, 6)
      .toUpperCase();
    const newGroup = await Group.create({
      name,
      ownerId,
      inviteCode: newInvitecode,
    });
    return res.status(201).json({
      group: newGroup,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
};
