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
    comments: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
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

module.exports = mongoose.model('Post', PostSchema);
