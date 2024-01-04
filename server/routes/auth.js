const express = require('express');
const authController = require('../controllers/auth');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/google', authController.googleAuth);

module.exports = authRouter;
