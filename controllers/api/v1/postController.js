const multer = require('multer');
const sharp = require('sharp');
const Post = require('../../../models/posts');
const Comment = require('../../../models/comments');
const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');
const handleFactory = require('./handleFactory');

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

exports.uploadPostImages = upload.single('photo');

//RESIZE IMAGES
exports.resizePostImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(640, 320)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`assets/img/posts/${req.file.filename}`);

  next();
});

//********************SET USER ID ON POST****************//
exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//********************UPDATE POST************************//
exports.updatePost = handleFactory.updateOne(Post);

//******************CREATE POST DATA*********************//
exports.postCreate = handleFactory.createOne(Post, {
  path: 'user likes',
  select: 'name photo',
});

//**********************DELETE POST************************//
exports.deletePost = handleFactory.deleteOne(Post, Comment);

//********************GET ALL POSTS BY USER ID******************//
exports.getAllPostByUser = handleFactory.getAllDocsByUser(Post);

//********************GET ALL POSTS********************//
exports.getAllPost = handleFactory.getAllOne(Post);
