import { eventUpdateSchema } from "../schemas/eventUpdateSchema.js";
import { ExpressError } from "./expressError.js";

export default function validateEvent(req, res, next) {
  const result = eventUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      new ExpressError(
        result.error.issues.map((i) => i.message).join(", "),
        400,
      ),
    );
  }

  req.body = result.data;
  next();
}
