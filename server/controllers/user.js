const User = require('../models/User');
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require('../services/cloudinary');

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
    const username = req.params.username;
    const foundUser = await User.findOne({ username: username });

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
    console.log(req.body);
    const id = req.params.userID;
    let dataFile;
    let body = {
      description: req.body.description,
    };
    const userToUpdate = await User.findById(id);
    if (req.file) {
      if (userToUpdate.avatar.imageUrl) {
        await removeFromCloudinary(userToUpdate.avatar.publicId);
      }
      dataFile = await uploadToCloudinary(req.file.path, 'avatar');
      body.avatar = { imageUrl: dataFile.url, publicId: dataFile.public_id };
    }
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

const followUser = async (req, res) => {
  try {
    const id = req.body.userToFollow;
    const user = await User.findById(req.user._id);
    const followedUser = await User.findById(id);
    if (id == user._id) {
      return res.status(500).json({
        success: false,
        message: 'You cannot follow yourself!',
      });
    }
    const found = user.following.includes(id);
    if (found) {
      await user.following.pull({ _id: id });
      await user.save();
      await followedUser.followers.pull({ _id: user._id });
      await followedUser.save();
      return res.status(200).json({
        success: true,
        message: 'Unfollowed user',
        user,
      });
    } else {
      await user.following.push({ _id: id });
      await user.save();
      await followedUser.followers.push({ _id: user._id });
      await followedUser.save();
      return res.status(200).json({
        success: true,
        message: 'Followed user',
        user,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err,
    });
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser, followUser };
