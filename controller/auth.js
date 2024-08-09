require('dotenv').config();

const bcrypt = require("bcryptjs/dist/bcrypt");
const createError = require("../utils/appError");
const jwt = require("jsonwebtoken")

const User = require("../models/user");
const secretKey = process.env.JWT_SECRET_KEY;

const registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({ email })
    if (user)
      return next(new createError("User already exist!"))

    const hashPass = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      username,
      password: hashPass
    })

    res.status(201).json({
      messsage: 'success',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    next(error);
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return next(new createError("User not found!", 404))

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new createError("Incorrect email or password!", 401));

    const token = jwt.sign({ _id: user._id }, secretKey, {
      expiresIn: '1h'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 1 * 1 * 60 * 60 * 1000, // 1hours
    })

    res.status(200).json({
      message: 'success',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    next(error)
  }
}

const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'success' });
};

const currentUser = (req, res, next) => {
  try {
    res.status(200).json({ message: 'success' });
  } catch (error) {
    next(error)
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser
}