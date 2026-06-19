const ExpressError = require("../middleware/expressError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      throw new ExpressError("All fields are required", 400);
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      throw new ExpressError("Email already in use.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      user: newUser,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
};
