import { apiRequest } from "./apiClient";

export function getGroups() {
  return apiRequest("/groups");
}

export function getGroup(groupId) {
  return apiRequest(`/groups/${groupId}`);
}
