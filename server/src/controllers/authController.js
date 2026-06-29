const ExpressError = require("../middleware/expressError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../utils/createToken");

async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      next(new ExpressError("All fields are required", 400));
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      next(new ExpressError("Email already in use.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = createToken(newUser);
    return res.status(201).json({
      user: newUser,
      token,
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

    if (!existingUser) {
      throw new ExpressError("Invalid Email. Try again", 400);
    }
    console.log(existingUser);
    const auth = await bcrypt.compare(password, existingUser.password);
    if (!auth) {
      throw new ExpressError("Incorrect Password. Try again", 400);
    }
    const token = createToken(existingUser);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 259200000 });
    res.status(200).json({
      user: existingUser.id,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res) {
  const { firstName, lastName, email } = req.body;
  const userId = req.user.id;
  const updatedUser = await User.patch({
    id: userId,
    firstName,
    lastName,
    email,
  });
  res.json(updatedUser);
}
module.exports = {
  register,
  login,
  updateProfile,
};
