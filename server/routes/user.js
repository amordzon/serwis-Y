const express = require('express');
const userController = require('../controllers/user.js');
//const middlewares = require('../middlewares/authentication');

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/user/:userID', userController.getUser);
userRouter.put('/:userID', userController.updateUser);
userRouter.delete('/:userID', userController.deleteUser);
userRouter.get('/follow/:userID', userController.followUser);

module.exports = userRouter;
