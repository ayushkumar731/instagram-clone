const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');
const Like = require('../../../models/likes');
const Post = require('../../../models/posts');
const Comment = require('../../../models/comments');

//**********************LIKE CREATE AND DESTROY*******************//
exports.like = catchAsync(async (req, res, next) => {
  let likeable;
  let deleted = false;

  if (req.query.type == 'Post') {
    likeable = await Post.findById(req.query.id).populate('likes');
    if (!likeable) {
      return next(new AppError('Query is not correct', 404));
    }
  } else {
    likeable = await Comment.findById(req.query.id).populate('likes');
    if (!likeable) {
      return next(new AppError('Query is not correct', 404));
    }
  }

  //if like allready exist
  let existingLike = await Like.findOne({
    likeable: req.query.id,
    onModel: req.query.type,
    user: req.user._id,
  });

  if (existingLike) {
    existingLike.remove();
    deleted = true;
  } else {
    let newLike = await Like.create({
      user: req.user._id,
      likeable: req.query.id,
      onModel: req.query.type,
    });
    doc = await newLike.populate('likes').execPopulate();
  }

  return res.status(200).json({
    status: 'success',
    data: {
      deleted,
    },
  });
});

//***********IF ONLY POST DELETED THEN MIDDLEWARE RUN**************//
exports.likeDestrobyPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No Post Found', 404));
  }

  if (post.user._id != req.user.id) {
    return next(
      new AppError('You do have permission to perform this action', 401)
    );
  }

  await Like.deleteMany({ likeable: post, onModel: 'Post' });
  const comments = await Comment.find({ post: req.params.id });

  await Like.deleteMany({ likeable: comments, onModel: 'Comment' });

  next();
});

//**********IF ONLY COMMENTS DELTED THEN RUN THIS MIDDLEWARE*****************//
exports.likeDestroyByComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate('post');
  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (comment.user._id != req.user.id && req.user.id != comment.post.user.id) {
    return next(
      new AppError('You do have permission to perform this action', 401)
    );
  }
  await Like.deleteMany({ likeable: comment, onModel: 'Comment' });
  next();
});
