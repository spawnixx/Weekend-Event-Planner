import { apiRequest } from "./apiClient";

export function loginUser(credentials) {
  return apiRequest("/users/login", {
    method: "POST",
    body: credentials,
  });
}

export function registerUser(userData) {
  return apiRequest("/users/register", {
    method: "POST",
    body: userData,
  });
}

export function getCurrentUser() {
  return apiRequest("/users/profile");
}

export function updateCurrentUser(updates) {
  return apiRequest("/users/profile", {
    method: "PATCH",
    body: updates,
  });
}

export function logoutUser() {
  return apiRequest("/users/logout", {
    method: "POST",
  });
}
