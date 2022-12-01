const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default
const webpack = require('webpack')
const paths = require('./paths')

module.exports = {
  entry: {
    app: paths.src + '/app.js',
    images: paths.src + '/image-responsive.js',
  },

  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    assetModuleFilename: 'assets-module/[name][ext]',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.assets,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'HomePage',
      template: paths.src + '/index.ejs',
      filename: 'index.html',
      chunks: ['app'],
      chunksConfig: {
        defer: ['app', 'vendor'],
      },
    }),
    // new WatchExternalFilesPlugin({
    //   files: [
    //     './src/**/*.ejs',
    //   ],
    // }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: {
          loader: 'ejs-templates-loader',
        },
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        // exclude: /node_modules/,
        use: [
          // 'glslify-import-loader',
          'raw-loader',
          'glslify-loader',
        ],
      },
      { test: /\.js$/, use: ['babel-loader'] },
      {
        test: /\.(|png|jpg|jpeg)$/i,
        type: 'javascript/auto',
        //for watch wordpress
        // generator: {
        //     filename: (filePath) => {
        //         return filePath.filename.replace('./src/', '').replace('src/', '');
        //     }
        // },
        use: [
          {
            loader: 'responsive-loader',
            options: {
              adapter: require('responsive-loader/sharp'),
              sizes: [50, 400, 800, 1200, 1600, 2400],
              placeholder: true,
              placeholderSize: 50,
              quality: 80,
              name: '[path][name]-[width].[ext]',
              context: './src/',
              outputPath: function(e) {
                console.log('__render image', e)
                return e
              },
            },
          },
        ],
      },
      {
        test: /\.(?:ico|gif|off(2)?|eot|ttf|otf|svg|)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: './src/',
            },
          },
        ],
        type: 'javascript/auto',
        // type: 'asset/resource',
        //for watch wordpress
        // generator: {
        //     filename: (filePath) => {
        //         return filePath.filename.replace('./src/', '').replace('src/', '');
        //     }
        // },
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      '@Modules': paths.src + '/modules',
      '@ThreeSketch': paths.src + '/threesketch',
      '@Animation': paths.src + '/animations',
      '@Component': paths.src + '/components',
      '@Libs': paths.src + '/libs',
      '@Systems': paths.src + '/systems',
      '@Styles': paths.src + '/styles',
      '@Assets': paths.assets,
    },
  },
}
