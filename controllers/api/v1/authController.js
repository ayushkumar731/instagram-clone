const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');
const crypto = require('crypto');
const nodemailer = require('../../../config/nodemailer');
var MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

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
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

//***********************SIGNIN SLACK NOTIFY******************//
const sendSignsUpNotification = (user) => {
  slack.success({
    text: 'new user signup',
    attachments: [
      {
        fields: [
          { title: 'Name', value: `${user.name}`, short: true },
          { title: 'Email', value: user.email, short: true },
        ]
      }
    ]
  });
}

//*******************CREATE NEW USER *************************//
exports.create = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  if (newUser) {
    sendSignsUpNotification(newUser);
  }

  // const verifyToken = await newUser.emailVerify();
  // await newUser.save({ validateBeforeSave: false });
  // const verifyURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/user/email-verify/${verifyToken}`;

  // const message = `Your Email verification Link ${verifyURL}`;

  // try {
  //   await nodemailer({
  //     email: newUser.email,
  //     subject: 'For verify Your email',
  //     message,
  //   });

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Verify Your Email Address.Please check your mail address',
  //   });
  // } catch (err) {
  //   newUser.emailVerificationToken = undefined;
  //   await newUser.save({ validateBeforeSave: false });

  //   return next(
  //     new AppError(
  //       'Something went wrong to send the mail, please try again later!',
  //       500
  //     )
  //   );
  // }.
  res.status(200).json({
    status: 'success',
    message: 'Sign up successfully',
  });
});

//**********************EMAIL VERIFICATION*****************//
exports.emailVerify = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  });

  if (!user) {
    return next(new AppError('Token is invalid', 400));
  }

  user.emailVerification = 'true';
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    message: 'Your email verfication is successfull',
  });
});

//**********************LOGIN SESSIONS**************************//
exports.createSession = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email/password', 401));
  }

  // if (user.emailVerification === false) {
  //   return next(new AppError('verify your email', 401));
  // }

  createSendToken(user, 200, req, res);
});

//********************FORGOT PASSWORD*************************//
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.emailVerification === false) {
    return next(new AppError('verify your email first', 401));
  }

  const resetToken = await user.changedPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/reset-password/${resetToken}`;

  const message = `Your Reset Password Link ${resetURL}`;

  try {
    await nodemailer({
      email: user.email,
      subject: 'Reset Password (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Check Your Email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'Something went wrong to send the mail, please try again later!',
        500
      )
    );
  }
});

//*************LOGOUT THE USER**************//
exports.destroy = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

//****************RESET PASSWORD****************************//
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  if (user.emailVerification === false) {
    return next(new AppError('verify your email', 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, req, res);
});

//******************UPDATE PASSWORD****************************//
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const pass = await user.checkPassword(
    req.body.currentPassword,
    user.password
  );
  if (!pass) {
    return next(new AppError('Your current password is incorrect', 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createSendToken(user, 200, req, res);
});

//****************** Only for rendered pages, no errors!*********************/
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded._id);
      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
