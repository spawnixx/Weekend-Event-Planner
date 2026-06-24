const jwt = require("jsonwebtoken");
require("dotenv").config();
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );
}

module.exports = createToken;
