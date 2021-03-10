const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'please provide email id'],
    },
    name: {
      type: String,
      required: [true, 'please provide name'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'please provide password'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'please provide confirm password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'password and confirm password are not same',
      },
    },
    emailVerification: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Friend',
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.emailVerify = async function () {
  const emailToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

  return emailToken;
};

UserSchema.methods.checkPassword = async function (formPass, userPass) {
  return await bcrypt.compare(formPass, userPass);
};

UserSchema.methods.changedPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const user = mongoose.model('User', UserSchema);
module.exports = user;
