const mongoose = require("mongoose")

const Schema = mongoose.Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false},
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date
},
  { timestamps: true }
)

module.exports = mongoose.model("user", userSchema)