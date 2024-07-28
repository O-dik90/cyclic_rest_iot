require('dotenv').config();

const bcrypt = require("bcryptjs/dist/bcrypt");
const createError = require("../utils/appError");
const jwt = require("jsonwebtoken")

const User = require("../models/user");
const secretKey = process.env.JWT_SECRET_KEY;

const registerUser = async(req, res, next) => {
  try {
    console.log(secretKey)
    const {email, username, password} = req.body;
    
    const user = await User.findOne({email})
    if (user)
      return next(new createError("User already exist!", 400))
    
    const hashPass = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      username,
      password: hashPass
    })

    const token = jwt.sign({_id: newUser._id}, secretKey, {
      expiresIn: '1d'
    })
    res.status(201).json({
      status: 'success',
      messsage: 'User registered successfully',
      token,
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

const loginUser = async(req, res, next) => {
  try {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});   
    if (!user)
      return next(new createError("User not found!", 404))

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
      return next(new createError("Incorrect email or password!", 401));

    const token = jwt.sign({_id: user._id}, secretKey, {
      expiresIn: '1d'
    })

    res.status(200).json({
      status: 'success',
      message: 'Logged is successfully',
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

module.exports = {
  registerUser,
  loginUser
}