const express = require('express');
const postController = require('../controllers/post.js');

const postRouter = express.Router();

postRouter.get('/', postController.getPosts);
postRouter.get('/post/:postID', postController.getPost);
postRouter.post('/', postController.createPost);

module.exports = postRouter;
