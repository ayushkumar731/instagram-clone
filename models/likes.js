const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'Like must belongs to the user'],
    },
    likeable: {
      type: mongoose.Schema.ObjectId,
      refPath: 'onModel',
      required: [true, 'Likes must belong to the Post or Comment'],
    },
    onModel: {
      type: String,
      required: [true, 'please provide onModel'],
      enum: ['Post', 'Comment'],
    },
  },
  {
    timestamps: true,
  },
);

const like = mongoose.model('Like', LikeSchema);
module.exports = like;
