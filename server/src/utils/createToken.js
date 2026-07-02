import jwt from "jsonwebtoken";
import "dotenv/config";
export function createToken(user) {
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
