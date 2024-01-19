const express = require('express');
const userController = require('../controllers/user.js');
const upload = require('../middlewares/photo.js');
const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/user/:username', userController.getUser);
userRouter.get('/blocked', userController.getBlockedUsers);
userRouter.put('/:userID', upload.single('img'), userController.updateUser);
userRouter.delete('/:userID', userController.deleteUser);
userRouter.patch('/follow', userController.followUser);
userRouter.patch('/block', userController.blockUser);

module.exports = userRouter;
