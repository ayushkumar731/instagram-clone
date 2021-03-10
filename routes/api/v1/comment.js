const express = require('express');
const router = express.Router();
const commentController = require('../../../controllers/api/v1/commentController');
const likeController = require('../../../controllers/api/v1/likeController');

const passport = require('passport');

router.use(passport.authenticate('jwt', { session: false }));

router
  .route('/:id')
  .post(
    commentController.checkPost,
    commentController.setUserPostId,
    commentController.commentCreate,
  )
  .patch(commentController.updateCommet)
  .delete(likeController.likeDestroyByComment, commentController.deleteComment)
  .get(commentController.getAllCommentsByUser);

router.get('/', commentController.getAllComments);
router.get('/post/:id', commentController.getAllCommentsByPost);

module.exports = router;
