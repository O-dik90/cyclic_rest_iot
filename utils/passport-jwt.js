const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const UserModel = require("../models/user");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = UserModel.findById(payload._id);
      if (user) return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport