const Friend = require('../../../models/friendships');
const User = require('../../../models/user');
const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');
const jwt = require('jsonwebtoken');

//***************GENERATE TOKEN********************//
const signToken = (id) => {
  return jwt.sign(id, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//***********************SEND RESPONSE*****************************************//
const createSendToken = (user, data, statusCode, req, res) => {
  const token = signToken(user.toJSON());

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      data,
    },
  });
};

//****************ADD OR REMOVE FRIENDS*****************//
exports.friend = catchAsync(async (req, res, next) => {
  let fromUser = await User.findById(req.user._id);
  let toUser = await User.findById(req.query.id);
  let deleted = false;

  let existingFriend = await Friend.findOne({
    from_user: req.user._id,
    to_user: req.query.id,
  });

  if (existingFriend) {
    fromUser.friends.pull(existingFriend._id);
    fromUser.save({ validateBeforeSave: false });
    existingFriend.remove();
    deleted = true;
  } else {
    let newFriend = await Friend.create({
      from_user: req.user._id,
      to_user: req.query.id,
    });

    fromUser.friends.push(newFriend);
    fromUser.save({ validateBeforeSave: false });
  }
  createSendToken(req.user, deleted, 200, req, res);
});
