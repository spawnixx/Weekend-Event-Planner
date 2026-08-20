import { apiRequest } from "./apiClient";

export function getGroups() {
  return apiRequest("/groups");
}

export function getGroup(groupId) {
  return apiRequest(`/groups/${groupId}`);
}

export function removeGroupMember(groupId, userId) {
  return apiRequest(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
}
export function deleteGroup(groupId) {
  return apiRequest(`/groups/${groupId}`, {
    method: "DELETE",
  });
}

export function createGroup(values) {
  return apiRequest(`/groups/create`, { method: "POST", body: values });
}

export function joinGroup(inviteCode) {
  return apiRequest("/groups/join", {
    method: "POST",
    body: { inviteCode },
  });
}
