const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.isOAuth ? false : true;
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    isOAuth: {
      type: Boolean,
      default: false,
    },
    avatar: {
      imageUrl: {
        type: String,
        default:
          'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg',
      },
      publicId: {
        type: String,
      },
    },
    description: {
      type: String,
      required: false,
    },
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
