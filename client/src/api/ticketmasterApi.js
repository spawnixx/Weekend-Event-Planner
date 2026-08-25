import { apiRequest } from "./apiClient";

function toTicketmasterDateTime(date, endOfDay = false) {
  if (!date) return null;

  const time = endOfDay ? "23:59:59" : "00:00:00";
  const parsedDate = new Date(`${date}T${time}`);

  return parsedDate.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function searchTicketmasterEvents({
  keyword,
  city,
  eventDateFrom,
  classificationName,
  eventDateTo,
  page = 0,
}) {
  const params = new URLSearchParams({
    page: String(page),
  });
  if (classificationName) {
    params.set("classificationName", classificationName);
  }

  if (keyword?.trim()) {
    params.set("keyword", keyword.trim());
  }

  if (city?.trim()) {
    params.set("city", city.trim());
  }

  if (eventDateFrom) {
    params.set("startDateTime", toTicketmasterDateTime(eventDateFrom));
  }

  if (eventDateTo) {
    params.set("endDateTime", toTicketmasterDateTime(eventDateTo, true));
  }

  return apiRequest(`/ticketmaster/events?${params.toString()}`);
}
