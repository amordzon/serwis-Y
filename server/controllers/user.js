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

const getBlockedUsers = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.user._id }).populate(
      'blocked'
    );
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
    const id = req.user._id;
    let body = {
      description: req.body.description,
    };
    const userToUpdate = await User.findById(id);
    if (req.file) {
      if (userToUpdate.avatar.imageUrl) {
        await removeFromCloudinary(userToUpdate.avatar.publicId);
      }
      const dataFile = await uploadToCloudinary(req.file.path, 'avatar');
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

const followUser = async (req, res) => {
  try {
    const id = req.body.userToFollow;
    const user = await User.findById(req.user._id);
    const followedUser = await User.findById(id);
    if (
      user.blocked.includes(id) ||
      followedUser.blocked.includes(req.user._id)
    ) {
      return res.status(500).json({
        success: false,
        message: 'You cannot follow blocked user!',
      });
    }
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

const blockUser = async (req, res) => {
  try {
    const id = req.body.userToBlock;
    const user = await User.findById(req.user._id);
    const userToBlock = await User.findById(id);

    if (id == user._id) {
      return res.status(500).json({
        success: false,
        message: 'You cannot block yourself!',
      });
    }
    const isFollowingUser = user.following.includes(id);
    if (isFollowingUser) {
      await user.following.pull({ _id: id });
      await user.save();
      await userToBlock.followers.pull({ _id: user._id });
      await userToBlock.save();
    }

    const isUserFollowed = userToBlock.following.includes(req.user._id);
    if (isUserFollowed) {
      await userToBlock.following.pull({ _id: id });
      await userToBlock.save();
      await user.followers.pull({ _id: userToBlock._id });
      await user.save();
    }

    const found = user.blocked.includes(id);
    if (found) {
      await user.blocked.pull({ _id: id });
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Unblocked user',
        user,
      });
    } else {
      await user.blocked.push({ _id: id });
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Blocked user',
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

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  followUser,
  blockUser,
  getBlockedUsers,
};
