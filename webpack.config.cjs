const path = require('node:path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './frontend/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[contenthash].js',
    publicPath: '',
    clean: true,
  },
  module: {
    rules: [{ test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] }],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './frontend/index.html' }),
    new MiniCssExtractPlugin({ filename: 'app.[contenthash].css' }),
    new CopyPlugin({ patterns: [{ from: 'frontend/images', to: 'images' }] }),
    new webpack.DefinePlugin({ __API_URL__: JSON.stringify(process.env.API_URL?.trim() || '') }),
  ],
};
