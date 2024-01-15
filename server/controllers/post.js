const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');

const aggregatePost = async (condition, sort, skipPosts, limitPosts) => {
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
    { $skip: skipPosts },
    { $limit: limitPosts },
  ]);
  return allPosts;
};

const getPosts = async (req, res) => {
  try {
    const postType = req.query.tweetsType;
    const pageNum = req.query.page ? req.query.page : 1;
    let condition = {};
    if (postType == 'following') {
      const currUser = await User.findById(req.user._id).exec();
      const followingIds = currUser.following.map(
        (followedUser) => followedUser._id
      );
      condition = { user: { $in: followingIds } };
    }
    const skipPosts = (pageNum - 1) * 5;
    const allPosts = await aggregatePost(
      condition,
      {
        $sort: { createdAt: -1 },
      },
      skipPosts,
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
    const pageNum = req.query.page ? req.query.page : 1;
    const skipPosts = (pageNum - 1) * 5;
    let condition = { user: user };
    const allUserPosts = await aggregatePost(
      condition,
      {
        $sort: { createdAt: -1 },
      },
      skipPosts,
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
    const condition = { _id: id };
    const foundPost = await aggregatePost(
      condition,
      {
        $sort: { createdAt: -1 },
      },
      0,
      1
    );
    if (foundPost.length <= 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
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
    const pageNum = req.query.page ? req.query.page : 1;
    const skipPosts = (pageNum - 1) * 5;
    const comments = await aggregatePost(
      { refPost: id },
      {
        $sort: { createdAt: -1 },
      },
      skipPosts,
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
    const condition = { _id: id };
    const pageNum = req.query.page ? req.query.page : 1;
    const skipPosts = (pageNum - 1) * 3;
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
    const ancestorsInfo = await aggregatePost(
      {
        _id: { $in: ancestorIds },
      },
      {
        $sort: { createdAt: -1 },
      },
      skipPosts,
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

    if (base) {
      const basePost = await Post.findById(base);
      if (!basePost) {
        return res.status(404).json({
          success: false,
          message: 'Base post not found',
        });
      }

      post.refPost = basePost._id;
    } else if (quoted) {
      const quotedPost = await Post.findById(quoted);
      if (!quotedPost) {
        return res.status(404).json({
          success: false,
          message: 'Quoted post not found',
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
