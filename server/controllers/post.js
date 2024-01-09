const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    const postType = req.query.tweetsType;
    let condition = {};
    if (postType == 'following') {
      const currUser = await User.findById(req.user._id).exec();
      const followingIds = currUser.following.map(
        (followedUser) => followedUser._id
      );
      condition = { user: { $in: followingIds } };
    }

    const allPosts = await Post.aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'quotedPost',
          as: 'quotedPostsCount',
        },
      },
      {
        $addFields: {
          quotedPostsCount: { $size: '$quotedPostsCount' },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'refPost',
          foreignField: '_id',
          as: 'refPostCount',
        },
      },
      {
        $addFields: {
          refPostCount: { $size: '$refPostCount' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
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
    ]);

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

const getPost = async (req, res) => {
  try {
    const id = req.params.postID;
    const foundPost = await Post.findById(id);

    if (!foundPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const count = await Post.countDocuments({ quotedPost: id });
    console.log(count);

    return res.status(200).json({
      success: true,
      message: 'Post info',
      post: foundPost,
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
      .populate('refPost quotedPost user')
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

module.exports = { getPosts, getPost, createPost };
