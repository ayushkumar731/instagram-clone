const Post = require('../../../models/posts');
const Comment = require('../../../models/comments');
const handleFactory = require('./handleFactory');
const AppError = require('../../../config/AppError');
const catchAsync = require('../../../config/catchAsynch');

//********************CHECK POST****************//
exports.checkPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }
  next();
});

//**************SET USER AND POST ID ON COMMENT****************//
exports.setUserPostId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.post) req.body.post = req.params.id;
  next();
};

//******************CREATE COMMENT DATA*********************//
exports.commentCreate = handleFactory.createOne(Comment, {
  path: 'user likes',
  select: 'name',
});

//********************UPDATE COMMENT************************//
exports.updateCommet = handleFactory.updateOne(Comment);

//**********************DELETE COMMENT************************//
exports.deleteComment = catchAsync(async (req, res, next) => {
  // FIND POST
  const checkUser = await Comment.findById(req.params.id).populate('post');

  //IF POST ARE NOT RELATED WITH THE ID
  if (!checkUser) {
    return next(new AppError('No doc found with that id', 404));
  }

  //IF POST ARE NOT RELATED WITH THE CURRENT USER THEN THROW AN ERROR
  if (
    checkUser.user.id != req.user.id &&
    req.user.id != checkUser.post.user.id
  ) {
    return next(
      new AppError('You do have permission to perform this action', 404)
    );
  }

  //DELETE POST
  const deleteDoc = await Comment.findByIdAndDelete(req.params.id);

  //IF POST ARE NOT RELATED WITH THE ID
  if (!deleteDoc) {
    return next(new AppError('No doc found with that id', 404));
  }

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      id: req.params.id,
    },
  });
});

//********************GET ALL COMMENTS BY USER ID******************//
exports.getAllCommentsByUser = handleFactory.getAllDocsByUser(Comment);

//********************GET ALL COMMENTS BY POST ID******************//
exports.getAllCommentsByPost = handleFactory.getAllDocsByPost(Comment);

//********************GET ALL COMMENTS********************//
exports.getAllComments = handleFactory.getAllOne(Comment);
