const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function apiRequest(
  endpoint,
  { method = "GET", body, headers = {}, ...options } = {},
) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...options,
  });

  let data = null;

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    const message =
      data?.error?.message ??
      data?.message ??
      res.statusText ??
      "Request failed";

    const error = new Error(message);

    error.status = res.status;
    error.data = data;

    throw error;
  }

  return data;
}
