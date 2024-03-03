//@ts-check

'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

// Configuration for main extension sources
/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  mode: 'none',

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    // modules added here also need to be added in the .vscodeignore file
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log",
  },
};

// Configuration for WebView sources
/** @type WebpackConfig */
const webviewConfig = {
  mode: 'none',
  entry: './src/webview/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/webview'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'ts-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/webview/index.html', to: path.resolve(__dirname, 'dist/webview') },
      ],
    }),
    new MiniCssExtractPlugin(),
    new NodePolyfillPlugin(),
  ]
};

module.exports = [extensionConfig, webviewConfig];
