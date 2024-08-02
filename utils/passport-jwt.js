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
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
        
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await UserModel.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});

module.exports = passport