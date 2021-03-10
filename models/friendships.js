const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema(
  {
    from_user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'from_user must belongs to current user'],
    },
    to_user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const friend = mongoose.model('Friend', FriendSchema);
module.exports = friend;
