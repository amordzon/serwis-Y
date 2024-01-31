const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const { uploadToCloudinary } = require('../services/cloudinary');

const aggregatePost = async (
  usersBlocked,
  userId,
  condition,
  sort,
  limitPosts
) => {
  const allPosts = await Post.aggregate([
    { $match: condition },
    sort,
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $match: {
        $or: [
          { 'user.blocked': { $nin: [userId] } },
          { 'user.blocked': { $exists: false } },
        ],
      },
    },
    {
      $lookup: {
        from: 'posts',
        localField: 'refPost',
        foreignField: '_id',
        as: 'refPost',
      },
    },
    {
      $unwind: {
        path: '$refPost',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'posts',
        localField: 'quotedPost',
        foreignField: '_id',
        as: 'quotedPost',
      },
    },
    {
      $unwind: {
        path: '$quotedPost',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'refPost.user',
        foreignField: '_id',
        as: 'refPost.user',
      },
    },
    {
      $unwind: {
        path: '$refPost.user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'quotedPost.user',
        foreignField: '_id',
        as: 'quotedPost.user',
      },
    },
    {
      $unwind: {
        path: '$quotedPost.user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        quotedPost: {
          $cond: {
            if: {
              $or: [
                { $in: ['$quotedPost.user._id', usersBlocked] },
                {
                  $and: [
                    { $ifNull: ['$quotedPost.user.blocked', false] },
                    { $in: [userId, '$quotedPost.user.blocked'] },
                  ],
                },
              ],
            },
            then: 'blocked',
            else: '$quotedPost',
          },
        },
      },
    },
    {
      $addFields: {
        refPost: {
          $cond: {
            if: {
              $or: [
                { $in: ['$refPost.user._id', usersBlocked] },
                {
                  $and: [
                    { $ifNull: ['$refPost.user.blocked', false] },
                    { $in: [userId, '$refPost.user.blocked'] },
                  ],
                },
              ],
            },
            then: 'blocked',
            else: '$refPost',
          },
        },
      },
    },
    { $limit: limitPosts },
  ]);
  return allPosts;
};

const getPosts = async (req, res) => {
  try {
    const postType = req.query.tweetsType;
    const targetDate = req.query.createdAt
      ? new Date(req.query.createdAt)
      : null;
    const currUser = await User.findById(req.user._id).exec();

    const usersBlocked = currUser.blocked.map((blockedUser) => blockedUser._id);
    let condition = { user: { $nin: usersBlocked } };
    if (targetDate && postType != 'following') {
      condition = {
        $and: [
          { user: { $nin: usersBlocked } },
          { createdAt: { $lt: targetDate } },
        ],
      };
    }

    if (postType == 'following') {
      const followingEntries = currUser.allFollowing;
      condition = {
        $and: [
          { user: { $nin: usersBlocked } },
          {
            $or: followingEntries.map((entry) => ({
              $and: [
                { user: entry.user },
                {
                  $and: [
                    { createdAt: { $gte: entry.startedAt } },
                    { createdAt: { $lte: entry.endedAt || new Date() } },
                  ],
                },
              ],
            })),
          },
        ],
      };

      if (targetDate) {
        condition.$and.push({ createdAt: { $lt: targetDate } });
      }
    }
    const currUserID = new mongoose.Types.ObjectId(req.user._id);
    const allPosts = await aggregatePost(
      usersBlocked,
      currUserID,
      condition,
      {
        $sort: { createdAt: -1 },
      },
      5
    );

    return res.status(200).json({
      success: true,
      message: 'All posts',
      posts: allPosts,
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

const getUsersPosts = async (req, res) => {
  try {
    const user = new mongoose.Types.ObjectId(req.params.userID);
    const userProfile = await User.findById(user).exec();
    const currUser = await User.findById(req.user._id).exec();
    if (
      userProfile.blocked.includes(req.user._id) ||
      currUser.blocked?.includes(user)
    ) {
      return res.status(500).json({
        success: false,
        message: 'You cannot view blocked user posts!',
        posts: [],
      });
    }
    const targetDate = req.query.createdAt
      ? new Date(req.query.createdAt)
      : null;
    let condition = { user: user };
    if (targetDate) {
      condition = {
        $and: [{ user: user }, { createdAt: { $lt: targetDate } }],
      };
    }

    const currUserID = new mongoose.Types.ObjectId(req.user._id);
    const usersBlocked = currUser.blocked.map((blockedUser) => blockedUser._id);

    const allUserPosts = await aggregatePost(
      usersBlocked,
      currUserID,
      condition,
      {
        $sort: { createdAt: -1 },
      },
      5
    );

    return res.status(200).json({
      success: true,
      message: 'All users posts',
      posts: allUserPosts,
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

const getPost = async (req, res) => {
  try {
    const postID = req.params.postID;
    const id = new mongoose.Types.ObjectId(postID);
    const currUser = await User.findById(req.user._id).exec();
    const condition = { _id: id };
    const currUserID = new mongoose.Types.ObjectId(req.user._id);
    const usersBlocked = currUser.blocked.map((blockedUser) => blockedUser._id);

    const foundPost = await aggregatePost(
      usersBlocked,
      currUserID,
      condition,
      {
        $sort: { createdAt: -1 },
      },
      1
    );
    if (foundPost.length <= 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (currUser.blocked.includes(foundPost[0].user._id)) {
      return res.status(500).json({
        success: true,
        message: 'Post blocked user',
        post: {},
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Post info',
      post: foundPost[0],
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

const getPostComments = async (req, res) => {
  try {
    const postID = req.params.postID;
    const id = new mongoose.Types.ObjectId(postID);
    const currUser = await User.findById(req.user._id).exec();
    const usersBlocked = currUser.blocked.map((blockedUser) => blockedUser._id);
    const targetDate = req.query.createdAt
      ? new Date(req.query.createdAt)
      : null;

    let condition = {
      $and: [{ user: { $nin: usersBlocked } }, { refPost: id }],
    };
    if (targetDate) {
      condition = {
        $and: [
          { user: { $nin: usersBlocked } },
          { refPost: id },
          { createdAt: { $lt: targetDate } },
        ],
      };
    }
    const currUserID = new mongoose.Types.ObjectId(req.user._id);
    const comments = await aggregatePost(
      usersBlocked,
      currUserID,
      condition,
      {
        $sort: { createdAt: -1 },
      },
      5
    );
    return res.status(200).json({
      success: true,
      message: 'Post comments',
      comments,
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

const getPostAncestors = async (req, res) => {
  try {
    const postID = req.params.postID;
    const id = new mongoose.Types.ObjectId(postID);
    const currUser = await User.findById(req.user._id).exec();
    const usersBlocked = currUser.blocked.map((blockedUser) => blockedUser._id);
    const condition = { $and: [{ _id: id }, { user: { $nin: usersBlocked } }] };
    const targetDate = req.query.createdAt
      ? new Date(req.query.createdAt)
      : null;
    const ancestors = await Post.aggregate([
      { $match: condition },
      {
        $graphLookup: {
          from: 'posts',
          startWith: '$refPost',
          connectFromField: 'refPost',
          connectToField: '_id',
          as: 'ancestors',
        },
      },
    ]);
    const ancestorIds = ancestors.flatMap((post) =>
      post.ancestors.map((ancestor) => ancestor._id)
    );
    const currUserID = new mongoose.Types.ObjectId(req.user._id);
    let conditionAncestors = {
      $and: [{ _id: { $in: ancestorIds } }, { user: { $nin: usersBlocked } }],
    };
    if (targetDate) {
      conditionAncestors = {
        $and: [
          { _id: { $in: ancestorIds } },
          { user: { $nin: usersBlocked } },
          { createdAt: { $lt: targetDate } },
        ],
      };
    }
    const ancestorsInfo = await aggregatePost(
      usersBlocked,
      currUserID,
      conditionAncestors,
      {
        $sort: { createdAt: -1 },
      },
      3
    );
    ancestorsInfo.reverse();
    return res.status(200).json({
      success: true,
      message: 'Post ancestors',
      ancestors: ancestorsInfo,
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

const createPost = async (req, res) => {
  try {
    const author = req.user._id;
    const authorProfile = await User.findById(author).exec();

    const quoted = req.body.quoted;
    const base = req.body.base;

    if (!req.body.body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide tweet body!',
      });
    }

    let post = new Post({
      user: author,
      body: req.body.body,
    });

    if (req.file) {
      const dataFile = await uploadToCloudinary(req.file.path, 'tweet');
      post.image = { imageUrl: dataFile.url, publicId: dataFile.public_id };
    }

    if (base) {
      const basePost = await Post.findById(base);
      const basePostUser = await User.findById(basePost.user).exec();

      if (!basePost) {
        return res.status(404).json({
          success: false,
          message: 'Base post not found',
        });
      }
      if (
        authorProfile.blocked?.includes(basePost.author) ||
        basePostUser.blocked?.includes(author)
      ) {
        return res.status(500).json({
          success: false,
          message: 'You cannot reply to blocked user post',
        });
      }
      post.refPost = basePost._id;
    } else if (quoted) {
      const quotedPost = await Post.findById(quoted);
      const quotedPostUser = await User.findById(quotedPost.user).exec();

      if (!quotedPost) {
        return res.status(404).json({
          success: false,
          message: 'Quoted post not found',
        });
      }
      if (
        authorProfile.blocked?.includes(quotedPost.author) ||
        quotedPostUser.blocked?.includes(author)
      ) {
        return res.status(500).json({
          success: false,
          message: 'You cannot quote blocked user post',
        });
      }
      post.isQuote = true;
      post.quotedPost = quotedPost._id;
    }

    let createdPost = await post.save();
    createdPost = await Post.findById(createdPost._id)
      .populate('user')
      .populate({
        path: 'quotedPost',
        populate: {
          path: 'user',
        },
      })
      .populate({
        path: 'refPost',
        populate: {
          path: 'user',
        },
      })
      .exec();

    authorProfile.followers.forEach((userId) => {
      console.log('nowy post follow', userId.toString());
      io.to(`user-${userId.toString()}`).emit('newFollowingPost');
    });

    return res.status(201).json({
      success: true,
      message: 'New post created successfully',
      Post: createdPost,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

module.exports = {
  getPosts,
  getUsersPosts,
  getPost,
  createPost,
  getPostComments,
  getPostAncestors,
};
