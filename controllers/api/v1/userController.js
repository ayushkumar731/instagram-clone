const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');
const handleFactory = require('./handleFactory');
const User = require('../../../models/user');
const Post = require('../../../models/posts');
const Comment = require('../../../models/comments');
const Like = require('../../../models/likes');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

//***************GENERATE TOKEN********************//
const signToken = (id) => {
  return jwt.sign(id, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//***********************SEND RESPONSE*****************************************//
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.toJSON());

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

//***************MULTER*********************************//
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload Image!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImage = upload.single('photo');

//RESIZE IMAGES
exports.resizeUserImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`assets/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedObj) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedObj.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'Password cannot be changed with this url. Please use /updatePassword url',
        400,
      ),
    );
  }
  const user = await User.findById(req.user._id);
  if (req.file) {
    if (user.photo != 'default.jpg') {
      fs.unlinkSync(
        path.join(__dirname, '../../../assets/img/users', user.photo),
      );
    }
  }
  const filterBody = filterObj(req.body, 'name', 'email');

  if (req.file) filterBody.photo = req.file.filename;

  const updateduser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  createSendToken(updateduser, 200, req, res);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Like.deleteMany({ user: req.user._id });
  await Comment.deleteMany({ user: req.user._id });
  await Post.deleteMany({ user: req.user._id });
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = handleFactory.getOne(User);
