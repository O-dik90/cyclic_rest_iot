require('dotenv').config();

const bcrypt = require("bcryptjs/dist/bcrypt");
const createError = require("../utils/appError");
const crypto = require("crypto");
const User = require("../models/user");
const generate = require('../utils/generatingCode');
const { sendVerifEmail, sendResetEmail, sendResetSuccessEmail } = require('../email/mail');


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

    // active if real production
    // await sendVerifEmail(newUser.email, verificationToken, next);
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

    const token = generate.TokenSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: 'success',
      token,
      user: {
        ...user._doc,
        password: undefined
      }
    })
  } catch (error) {
    next(error)
  }
}

const logoutUser = (req, res) => {
  res.cookie("token");
  res.status(200).json({ message: 'success' });
};

const verifyUser = async (req, res, next) => {
  // 1 2 3 4 5 6 
  try {
    const { code } = req.body;
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    })

    if (!user)
      return next(new createError("Invalid or expired verification code", 400))

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      message: 'success',
      user: {
        username: user.username,
        email: user.email,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    next(error)
  }
}

const forgotUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return next(new createError("User not found", 400));

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendResetEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

    res.status(200).json({
      message: "success",
      user: {
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        tokenReset: resetToken
      }
    })
  } catch (error) {
    next(error);
  }
}

const resettingUser = async (req, res, next) => {
  try {
    const { token } = req.params.id
    const { email, password } = req.body

    const user = await User.findOne({
			resetPasswordToken: token
		});

    if (!user)
      return next(new createError("Invalid or expired reset token", 400))

    const hashPass = await bcrypt.hash(password, 12);

    user.password = hashPass
    user.resetPasswordExpiresAt = undefined
    user.resetPasswordExpiresAt = undefined

    await user.save();
    await sendResetSuccessEmail(email);

    res.status(200).json({
      message: "success",
    })
  } catch (error) {
    next(error)
  }
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  forgotUser,
  resettingUser
}