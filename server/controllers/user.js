const User = require('../models/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({
      success: true,
      message: 'All users',
      Users: allUsers,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.userID;
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User info',
      user: foundUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.userID;
    const body = req.body.password
      ? {
          password: await bcrypt.hash(req.body.password, 10),
          email: req.body.email,
          name: req.body.name,
          username: req.body.username,
        }
      : {
          email: req.body.email,
          name: req.body.name,
          username: req.body.username,
        };

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User is updated',
      User: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.userID;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err,
    });
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
