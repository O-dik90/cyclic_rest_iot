const jwt = require("jsonwebtoken")
const secretKey = process.env.JWT_SECRET_KEY;

const VerifToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const TokenSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: '1d'
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1day
  })

  return token;
}

module.exports = {
  VerifToken,
  TokenSetCookie
}