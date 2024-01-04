const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwtSecret = toString(process.env.TOKEN_SECRET);

module.exports = function (passport) {
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user || user.isOAuth) {
            return done(null, false);
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: jwtSecret,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
