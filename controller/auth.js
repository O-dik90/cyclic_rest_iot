require('dotenv').config();

const bcrypt = require("bcryptjs/dist/bcrypt");
const createError = require("../utils/appError");

const User = require("../models/user");
const generate = require('../utils/generatingCode');
const { sendVerifEmail } = require('../email/mail');


const registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return next(new User.create("All field are required"))

    const user = await User.findOne({ email })
    if (user)
      return next(new createError("User already exist!"))

    const hashPass = await bcrypt.hash(password, 12);
    const verificationToken = generate.VerifToken();
    const newUser = new User({
      email,
      username,
      password: hashPass,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 3 * 60 * 60 * 1000 //3hours
    })

    await sendVerifEmail(email, verificationToken);
    await newUser.save();
    
    generate.TokenSetCookie(res, newUser._id);
    
    res.status(201).json({
      messsage: 'success',
      user: {
        ...newUser._doc,
        password: undefined
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

    generate.TokenSetCookie(res, newUser._id);

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