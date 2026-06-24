const ExpressError = require("./expressError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ExpressError("No Token", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    throw new ExpressError("Invalid Token", 401);
  }
};
