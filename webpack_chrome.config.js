const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  entry: {
    index: './src/index.ts',
    background: './src/background.ts'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  plugins: [
    new Dotenv(),
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
