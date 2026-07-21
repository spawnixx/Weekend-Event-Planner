import { ExpressError } from "../middleware/expressError.js";
import { Event } from "../models/eventModel.js";

export async function createEvent(req, res, next) {
  try {
    const groupId = req.params.id;
    const newEvent = await Event.createEvent({
      ...req.body,
      groupId,
    });
    return res.status(201).json({
      event: newEvent,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getGroupEvents(req, res, next) {
  try {
    const { id } = req.params;
    await Event.closeExpiredEvents();
    const events = await Event.findByGroup(id);

    return res.json({
      events,
    });
  } catch (err) {
    return next(err);
  }
}

export async function voteEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const { vote } = req.body;

    const userId = req.user.id;

    if (typeof vote !== "boolean") {
      return next(new ExpressError("Vote must be true or false", 400));
    }

    const updatedVote = await Event.vote({
      eventId,
      userId,
      vote,
    });

    const event = await Event.findByIdWithMembers(eventId);
    const votesFor = Number(event.votes_for);
    const totalMembers = event.members.length;

    console.log({
      votes_for: event.votes_for,
      members: event.members.length,
      ratio: votesFor / totalMembers,
    });
    if (votesFor / totalMembers >= 0.5) {
      console.log("Updating status");
      const updatedEvent = await Event.updateStatus(eventId, "confirmed");
    } else if (votesFor / totalMembers < 0.5) {
      console.log("Updating status");
      const updatedEvent = await Event.updateStatus(eventId, "proposed");
    }

    return res.json({
      vote: updatedVote,
      event,
    });
  } catch (err) {
    return next(err);
  }
}
