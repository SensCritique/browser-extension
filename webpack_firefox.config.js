const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

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
    new CopyPlugin([
      { from: 'images/logo*', to: '.' },
      { from: 'manifest_firefox.json', to: 'manifest.json' }
    ])
  ],
  output: {
    path: path.resolve(__dirname, 'dist/firefox/main'),
    filename: '[name]/index.js'
  }
}
