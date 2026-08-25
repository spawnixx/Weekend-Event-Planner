import { ExpressError } from "../middleware/expressError.js";

const TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2";

export class TicketmasterService {
  static async searchEvents({
    keyword,
    city,
    classificationName,
    startDateTime,
    endDateTime,
    page = 0,
    size = 20,
  }) {
    const key = process.env.TICKETMASTER_API_KEY;
    if (!key) {
      throw new ExpressError("Ticketmaster API key is not configured", 500);
    }
    const params = new URLSearchParams({
      apikey: key,
      page: String(page),
      size: String(size),
      sort: "date,asc",
    });

    if (keyword) {
      params.set("keyword", keyword);
    }
    if (city) {
      params.set("city", city);
    }
    if (classificationName) {
      params.set("classificationName", classificationName);
    }
    if (startDateTime) {
      params.set("startDateTime", startDateTime);
    }
    if (endDateTime) {
      params.set("endDateTime", endDateTime);
    }

    const url = `${TICKETMASTER_BASE_URL}/events.json?${params}`;

    let res;

    try {
      res = await fetch(url);
    } catch {
      throw new ExpressError("Unable to connect to Ticketmaster", 502);
    }

    const data = await res.json();

    if (!res.ok) {
      console.error("Ticketmaster error:", data);
      throw new ExpressError("Ticketmaster event search failed", 502);
    }
    const events = data._embedded?.events ?? [];

    return {
      events: events.map((event) => TicketmasterService.normalizeEvent(event)),
      page: {
        number: data.page?.number ?? 0,
        size: data.page?.size ?? size,
        totalElements: data.page?.totalElements ?? 0,
        totalPages: data.page?.totalPages ?? 0,
      },
    };
  }

  static normalizeEvent(event) {
    const venue = event._embedded?.venues?.[0];

    const image =
      event.images?.find(
        (item) => item.ratio === "16_9" && item.width >= 1024,
      ) ??
      event.images?.find((item) => item.ratio === "16_9") ??
      event.images?.[0];

    const latitude = venue?.location?.latitude;
    const longitude = venue?.location?.longitude;

    return {
      ticketmasterId: event.id,
      title: event.name,
      description: event.info ?? event.pleaseNote ?? event.description ?? "",
      startDate:
        event.dates?.start?.dateTime ??
        TicketmasterService.combineLocalDateTime(
          event.dates?.start?.localDate,
          event.dates?.start?.localTime,
        ),
      endDate: event.dates?.end?.dateTime || null,
      location: venue?.name ?? TicketmasterService.formatAddress(venue),
      venueName: venue?.name ?? "",
      address: TicketmasterService.formatAddress(venue),
      city: venue?.city?.name ?? "",
      state: venue?.state?.stateCode ?? venue?.state?.name ?? "",
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      eventImageUrl: image?.url ?? null,
      ticketUrl: event.url ?? null,
    };
  }
  static formatAddress(venue) {
    if (!venue) return "";

    return [
      venue.address?.line1,
      venue.city?.name,
      venue.state?.stateCode ?? venue.state?.name,
      venue.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  static combineLocalDateTime(date, time) {
    if (!date) return null;

    return time ? `${date}T${time}` : date;
  }
}
