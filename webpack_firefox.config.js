const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index:  './src/index.js',
    background:  './src/background.js',
  },
  plugins: [
    new CopyPlugin([
      { from: 'images/logo*', to: '.' },
      { from: 'manifest_firefox.json', to: 'manifest.json'}
    ]),
  ],
  output: {
    path: path.resolve(__dirname, 'dist/firefox/main'),
    filename: '[name]/index.js',
  }
};
