const User = require('../../../models/user');
const catchAsync = require('../../../config/catchAsynch');
const AppError = require('../../../config/AppError');

exports.searchByName = catchAsync(async (req, res, next) => {
  const user = await User.find({
    name: { $regex: `^${req.params.name}.*`, $options: 'i' },
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});
