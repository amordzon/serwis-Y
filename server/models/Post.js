const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    refPost: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isQuote: {
      type: Boolean,
      default: false,
    },
    quotedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: function () {
        return this.isQuote ? true : false;
      },
    },
  },
  { timestamps: true }
);

PostSchema.pre('aggregate', async function () {
  this.pipeline().unshift(
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
    }
  );

  this.pipeline().unshift(
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'refPost',
        as: 'refPostCount',
      },
    },
    {
      $addFields: {
        refPostCount: { $size: '$refPostCount' },
      },
    }
  );
});

module.exports = mongoose.model('Post', PostSchema);
