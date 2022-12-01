const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { merge } = require('webpack-merge')

const paths = require('./paths')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  // output: {
  //   path: paths.build,
  //   publicPath: '/',
  //   filename: 'js/[name].[contenthash].bundle.js',
  // },
  plugins: [
    new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://mone-trip.localhost/'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  plugins: [
    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: '[id].css',
    }),
  ]
})
