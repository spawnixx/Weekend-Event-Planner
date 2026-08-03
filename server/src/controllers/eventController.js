import { ExpressError } from "../middleware/expressError.js";
import { Event } from "../models/eventModel.js";

export async function createEvent(req, res, next) {
  try {
    const groupId = req.params.id;
    const proposedBy = req.user.id;

    const newEvent = await Event.createEvent({
      ...req.body,
      groupId,
      proposedBy,
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
    const existingEvent = await Event.findByIdWithMembers(eventId);
    if (!existingEvent) {
      throw new ExpressError("Event not found", 404);
    }

    const updatedVote = await Event.vote({
      eventId,
      userId,
      vote,
    });
    const updatedEvent = await Event.findByIdWithMembers(eventId);

    const votesFor = Number(updatedEvent.votes_for);
    const totalMembers = updatedEvent.members.length;

    console.log({
      votes_for: updatedEvent.votes_for,
      members: updatedEvent.members.length,
      ratio: votesFor / totalMembers,
    });
    if (votesFor / totalMembers >= 0.5) {
      console.log("Updating status");
      await Event.updateStatus(eventId, "confirmed");
    } else if (votesFor / totalMembers < 0.5) {
      console.log("Updating status");
      await Event.updateStatus(eventId, "proposed");
    }

    return res.json({
      vote: updatedVote,
      updatedEvent,
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const existingEvent = await Event.findByIdWithMembers(eventId);

    if (!existingEvent) {
      throw new ExpressError("Event not found", 404);
    }

    if (existingEvent.status !== "proposed") {
      throw new ExpressError("Only proposed events can be edited", 409);
    }

    const updatedEvent = await Event.updateEvent(eventId, req.body);
    return res.json({
      event: updatedEvent,
    });
  } catch (err) {
    return next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const deletedEvent = await Event.deleteEvent(eventId);

    if (!deletedEvent) {
      throw new ExpressError("Event not found", 404);
    }

    return res.json({
      message: "Event deleted",
      eventId: deletedEvent.id,
    });
  } catch (err) {
    return next(err);
  }
}
