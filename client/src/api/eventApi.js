import { apiRequest } from "./apiClient";

export function getGroupEvents(groupId) {
  return apiRequest(`/groups/${groupId}/events`);
}

export function voteOnEvent(groupId, eventId, vote) {
  return apiRequest(`/groups/${groupId}/events/${eventId}/vote`, {
    method: "POST",
    body: { vote },
  });
}

export function createEvent(groupId, eventData) {
  return apiRequest(`/groups/${groupId}/events`, {
    method: "POST",
    body: eventData,
  });
}
export function updateEvent(groupId, eventId, eventData) {
  return apiRequest(`/groups/${groupId}/events/${eventId}`, {
    method: "PATCH",
    body: eventData,
  });
}
export function deleteEvent(groupId, eventId) {
  return apiRequest(`/groups/${groupId}/events/${eventId}`, {
    method: "DELETE",
  });
}
