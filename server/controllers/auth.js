const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const jwtSecret = toString(process.env.TOKEN_SECRET);

const clientIDGoogle = process.env.CLIENT_ID_GOOGLE;
const clientSecretGoogle = process.env.CLIENT_SECRET_GOOGLE;
const callbackURLGoogle = process.env.CALLBACK_URL;

const generateToken = (user) => {
  return jwt.sign({ user }, jwtSecret, {
    expiresIn: '7d',
  });
};

const register = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username || !req.body.name || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

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

const googleAuth = async (req, res) => {
  try {
    const code = req.headers.authorization;
    console.log('Authorization Code:', code);

    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientIDGoogle,
      client_secret: clientSecretGoogle,
      redirect_uri: callbackURLGoogle,
      grant_type: 'authorization_code',
    });
    const accessToken = response.data.access_token;

    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userDetails = userResponse.data;
    console.log('User Details:', userDetails);

    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser && existingUser.isOAuth) {
      const token = generateToken(existingUser);
      return res.status(201).json({
        success: true,
        message: 'Logged in successfully',
        user: {
          token,
          User: existingUser,
        },
      });
    } else if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    const newUser = new User({
      email: userDetails.email,
      name: userDetails.name,
      username: userDetails.name,
      isOAuth: true,
    });
    await newUser.save();

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: 'New user created and logged in successfully',
      user: {
        token,
        User: newUser,
      },
    });
  } catch (error) {
    console.error('Error saving code:', error);
    res.status(500).json({ message: 'Failed to save code' });
  }
};

module.exports = { register, login, googleAuth };
