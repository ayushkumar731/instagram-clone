const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
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

exports.PostImages = upload.single('photo');

exports.upload = catchAsync(async (req, res, next) => {
  if (req.file) {
    const S3 = await new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    let file = req.file.originalname.split('.');
    const fileType = file[file.length - 1];

    const fileName = Math.floor(new Date() / 1000);
    const filePath = `${fileName}.${fileType}`;
    const key = filePath;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ACL: 'public-read',
    }
    req.file.filename = `${process.env.S3_BUCKET_LINK}/${key}`;
    await S3.upload(params, (error, data) => {
      if (error) {
        console.log('error to upload a image')
      }
    })
  }
  next();
})

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
  select: 'name photo email',
});

//**********************DELETE POST************************//
exports.deletePost = handleFactory.deleteOne(Post, Comment);

//********************GET ALL POSTS BY USER ID******************//
exports.getAllPostByUser = handleFactory.getAllDocsByUser(Post);

//********************GET ALL POSTS********************//
exports.getAllPost = handleFactory.getAllOne(Post);
