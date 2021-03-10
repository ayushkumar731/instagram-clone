const catchAsync = require('../config/catchAsynch');
const Post = require('../models/posts');
const User = require('../models/user');
const AppError = require('../config/AppError');
const Friends = require('../models/friendships');

module.exports.home = catchAsync(async (req, res, next) => {
  const posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
      populate: {
        path: 'likes',
      },
    })
    .populate('likes');

  return res.render('home', {
    title: 'home page',
    posts: posts,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('back');
  }
  return res.render('sign-up', {
    title: 'Sign up',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('back');
  }
  return res.render('sign-in', {
    title: 'Login',
  });
});

exports.forgot = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('back');
  }
  return res.render('forgot', {
    title: 'Reset Password',
  });
});
exports.emailVerification = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('back');
  }
  return res.render('emailVerify', {
    title: 'Email Verification',
  });
});

exports.resetForgotPass = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('back');
  }
  return res.render('reset-password', {
    title: 'Reset Password',
  });
});

exports.profile = catchAsync(async (req, res, next) => {
  const linkUser = await User.findById(req.params.id);
  const currUser = await User.findById(req.user._id);
  const friend = await Friends.findOne({
    from_user: req.user._id,
    to_user: req.params.id,
  });

  if (!linkUser) {
    return next(new AppError('User Not Found'));
  }
  const post = await Post.find({ user: req.params.id });

  return res.render('profile', {
    title: ` profile | ${linkUser.name}`,
    posts: post,
    linkUser: linkUser,
    user: currUser,
    friend,
  });
});

exports.profileSettings = catchAsync(async (req, res, next) => {
  return res.render('setting', {
    title: 'Settings',
  });
});
