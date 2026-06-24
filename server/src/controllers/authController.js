const ExpressError = require("../middleware/expressError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

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

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new ExpressError("Email and password required", 400);
    }
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const auth = await bcrypt.compare(password, existingUser.password);
      if (!auth) {
        throw new ExpressError("Incorrect Password. Try again", 400);
      }
      const token = createToken(existingUser.id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({
        user: existingUser.id,
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
