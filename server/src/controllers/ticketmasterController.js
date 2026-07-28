import { ExpressError } from "../middleware/expressError.js";
import { TicketmasterService } from "../services/ticketmasterService.js";

export async function searchTicketmasterEvents(req, res, next) {
  try {
    const { keyword, city, postalCode, startDateTime, endDateTime, page } =
      req.query;

    if (!keyword && !city && !postalCode) {
      throw new ExpressError("Enter a keyword, city, or postal code", 400);
    }

    const results = await TicketmasterService.searchEvents({
      keyword: keyword?.trim(),
      city: city?.trim(),
      postalCode: postalCode?.trim(),
      startDateTime,
      endDateTime,
      page: Number(page) || 0,
      size: 20,
    });

    return res.json(results);
  } catch (err) {
    return next(err);
  }
}
