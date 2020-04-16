const path = require('path');

module.exports = {
  entry: {
    index:  './src/index.js',
    background:  './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: '[name]/index.js',
  }
};
