const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');
const fs = require('fs');
const path = require('path');
const Slack = require('../../../services/slack');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//******************CREATE DOC DATA*********************//
exports.createOne = (Model, poptOptions) =>
  catchAsync(async (req, res, next) => {
    const filterBody = filterObj(req.body, 'content', 'user', 'post');

    if (req.file) filterBody.photo = req.file.filename;
    //CREATE
    let doc = await Model.create(filterBody);

    if (poptOptions) {
      doc = await doc.populate(poptOptions).execPopulate();
    }
    if (!doc.post) {
      Slack.sendPostNotification(doc.user, doc.content);
    }

    if (doc.post) {
      Slack.sendCommentNotification(doc.user, doc.content);
    }

    //SEND RESPONSE
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

//********************UPDATE DOC************************//
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //FIND DOC
    const checkUser = await Model.findById(req.params.id);

    //IF DOC NOT FOUND WITH THAT ID
    if (!checkUser) {
      return next(new AppError('No doc found with this id', 404));
    }

    //DOC NOT RELATED WITH CURRENT USER THEN THROW AN ERROR
    if (checkUser.user.id != req.user.id) {
      return next(
        new AppError('You do not have permission to perform this action', 404)
      );
    }

    if (req.file) {
      if (checkUser.photo) {
        fs.unlinkSync(
          path.join(__dirname, '../../../assets/img/posts', checkUser.photo)
        );
      }
    }

    const filterBody = filterObj(req.body, 'content');
    if (req.file) filterBody.photo = req.file.filename;

    // IF RELATED THEN UPDATE DOC
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      filterBody,
      {
        new: true,
        runValidators: true,
      }
    );

    //IF DOC NOT FOUND WITH THAT ID
    if (!updatedDoc) {
      return next(new AppError('No doc found with this id', 404));
    }

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: updatedDoc,
    });
  });

//**********************DELETE DOC************************/
exports.deleteOne = (Model, Opts) =>
  catchAsync(async (req, res, next) => {
    // FIND POST
    const checkUser = await Model.findById(req.params.id);

    //IF POST ARE NOT RELATED WITH THE ID
    if (!checkUser) {
      return next(new AppError('No doc found with that id', 404));
    }

    //IF POST ARE NOT RELATED WITH THE CURRENT USER THEN THROW AN ERROR
    if (checkUser.user.id != req.user.id) {
      return next(
        new AppError('You do have permission to perform this action', 404)
      );
    }

    if (checkUser.photo) {
      fs.unlinkSync(
        path.join(__dirname, '../../../assets/img/posts', checkUser.photo)
      );
    }

    //DELETE POST
    const deleteDoc = await Model.findByIdAndDelete(req.params.id);

    //IF POST ARE NOT RELATED WITH THE ID
    if (!deleteDoc) {
      return next(new AppError('No doc found with that id', 404));
    }
    if (Opts) {
      const deleteDocs = await Opts.deleteMany({ post: req.params.id });
    }

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: {
        id: req.params.id,
      },
    });
  });

//********************GET ALL DOCS BY USER ID******************//
exports.getAllDocsByUser = (Model) =>
  catchAsync(async (req, res, next) => {
    //FIND DOC
    const doc = await Model.find({ user: req.params.id });

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

//***************GET ALL DOCS BY POST ID(COMMENT USE)******************//
exports.getAllDocsByPost = (Model) =>
  catchAsync(async (req, res, next) => {
    //FIND DOC
    const doc = await Model.find({ post: req.params.id });

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

//********************GET ALL DOCS********************//
exports.getAllOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // FIND DOC (LETEST TO OLDEST)
    const doc = await Model.find().sort('-createdAt');

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

//**************GET ONE DOC BY ID**************//

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
