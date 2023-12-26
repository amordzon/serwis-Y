const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const jwtSecret = toString(process.env.TOKEN_SECRET);

const generateToken = (user) => {
  return jwt.sign({ user }, jwtSecret, {
    expiresIn: '7d',
  });
};

const register = async (req, res) => {
  try {
    const { email, username } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        password: hash,
      });
      await newUser.save();
      passport.authenticate('login', { session: false }, (err, user) => {
        if (err || !user) {
          return res.status(500).json({
            success: false,
            message: 'Error during login after registration',
            error: err || 'User not found',
          });
        }
        const token = generateToken(newUser);
        return res.status(201).json({
          success: true,
          message: 'New user created and logged in successfully',
          user: {
            user,
            token,
          },
        });
      })(req, res);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: err.message,
    });
  }
};

const login = (req, res) => {
  try {
    passport.authenticate('login', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(500).json({
          success: false,
          message: 'Error during login',
          error: err || 'User not found',
        });
      }

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Logged in successfully',
        user: {
          user,
          token,
        },
      });
    })(req, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: err.message,
    });
  }
};

module.exports = { register, login };
