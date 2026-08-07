import { apiRequest } from "./apiClient";

export function getGroups() {
  return apiRequest("/groups");
}

export function getGroup(groupId) {
  return apiRequest(`/groups/${groupId}`);
}

export function removeGroupMember(groupId) {
  return apiRequest(`/groups/${groupId}/leave`, {
    method: "DELETE",
  });
}
export function deleteGroup(groupId) {
  return apiRequest(`/groups/${groupId}`, {
    method: "DELETE",
  });
}
