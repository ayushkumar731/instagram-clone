const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './assets/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'assets/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
