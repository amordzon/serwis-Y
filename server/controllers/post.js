const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({})
      .populate('refPost')
      .populate('quotedPost')
      .exec();

    console.log(allPosts);
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

    const createdPost = await post.save();
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
