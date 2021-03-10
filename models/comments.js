const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'please provide comment to post'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'comments must belongs to the user'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'comments must belongs to the post'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'likeable',
  localField: '_id',
});

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'likes',
  });
  next();
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
