const express = require('express');
const router = express.Router();
const postController = require('../../../controllers/api/v1/postController');
const likeController = require('../../../controllers/api/v1/likeController');
const passport = require('passport');

router.use(passport.authenticate('jwt', { session: false }));

router
  .route('/')
  .post(
    postController.PostImages,
    postController.upload,
    postController.setUserId,
    postController.postCreate,
  )
  .get(postController.getAllPost);

router
  .route('/:id')
  .patch(
    postController.PostImages,
    postController.resizePostImages,
    postController.upload,
    postController.updatePost,
  )
  .delete(likeController.likeDestrobyPost, postController.deletePost)
  .get(postController.getAllPostByUser);

module.exports = router;
