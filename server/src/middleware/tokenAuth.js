import { ExpressError } from "./expressError.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const tokenAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new ExpressError("No Token", 401));
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);
    return next(new ExpressError(err.message, 401));
  }
};
