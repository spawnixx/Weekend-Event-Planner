import { ExpressError } from "../middleware/expressError.js";
import { Event } from "../models/eventModel.js";

export async function createEvent(req, res, next) {
  try {
    const groupId = req.params.id;
    const {
      title,
      startDate,
      endDate,
      location,
      googleMapsApiId,
      ticketmasterId,
      eventImageUrl,
      description,
      votingEnds,
    } = req.body;

    if (
      !title ||
      !startDate ||
      !endDate ||
      !location ||
      !description ||
      !votingEnds
    ) {
      return next(new ExpressError("Fill all required fields", 400));
    }
    const newEvent = await Event.createEvent({
      groupId,
      title,
      startDate,
      endDate,
      location,
      googleMapsApiId,
      ticketmasterId,
      eventImageUrl,
      description,
      votingEnds,
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
    const events = await Event.findByGroup(id);

    return res.json({
      events,
    });
  } catch (err) {
    return next(err);
  }
}
