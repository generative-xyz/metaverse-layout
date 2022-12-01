const {merge} = require('webpack-merge');
const webpack = require("webpack");
const common = require('./webpack.common');

module.exports = merge(common, {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    devServer: {
        watchFiles: ['src/**/*.ejs', 'src/assets/**/*'],
        historyApiFallback: true,
        open: true,
        compress: true,
        liveReload: true,
        hot: true,
        port: 8080,
    },

    module: {
        rules: [
            // Styles: Inject CSS into the head with source maps
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true, importLoaders: 1, modules: false},
                    },
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}},
                ],
            },
        ],
    },
})
