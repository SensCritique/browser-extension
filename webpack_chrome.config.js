const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'
      }
    ]
  },
  entry: {
    index: './src/index.js',
    background: './src/background.js'
  },
  plugins: [
    new CopyPlugin([
      { from: 'images/logo*', to: '.' },
      { from: 'manifest_chrome.json', to: 'manifest.json' }
    ])
  ],
  output: {
    path: path.resolve(__dirname, 'dist/chrome/main'),
    filename: '[name]/index.js'
  }
}
