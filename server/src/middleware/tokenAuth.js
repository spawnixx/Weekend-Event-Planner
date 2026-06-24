const ExpressError = require("./expressError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.redirect("/login");
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

module.exports = tokenAuth;
