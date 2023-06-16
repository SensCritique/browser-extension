const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')

module.exports = (env) => {
  return {
    devtool: 'source-map',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.tsx?$/, loader: 'ts-loader' },
        { test: /\.js$/, loader: 'source-map-loader' },
      ],
    },
    entry: {
      index: './src/index.ts',
      background: './src/background.ts',
    },
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    plugins: [
      new EnvironmentPlugin({ NODE_ENV: env }),
      new CopyPlugin([
        { from: 'images/logo*', to: '.' },
        { from: 'manifest_opera.json', to: 'manifest.json' },
      ]),
    ],
    output: {
      path: path.resolve(__dirname, 'dist/opera/main'),
      filename: '[name]/index.js',
    },
  }
}
