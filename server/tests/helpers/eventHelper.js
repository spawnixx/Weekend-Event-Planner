import { Event } from "../../src/models/eventModel.js";

export async function createTestEvent(groupId, proposedBy, overrides = {}) {
  const now = new Date();

  const defaults = {
    title: "Test Event",
    startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    ),
    location: "123 Test Street",
    latitude: null,
    longitude: null,
    googleMapsApiId: null,
    ticketmasterId: null,
    eventImageUrl: null,
    description: "A test event",
    votingEnds: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
  };

  return Event.createEvent({
    ...defaults,
    ...overrides,
    groupId,
    proposedBy,
  });
}
