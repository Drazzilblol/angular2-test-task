const HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: '[name].bundle.js'
    },
    mode: "production",
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.(html)$/,
                use: 'html-loader'
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),

        new CopyPlugin([
            {from: 'src/app/locales/*', to: 'locales', flatten: true},
        ]),

        new MiniCssExtractPlugin(),
    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
            chunks: "all"
        },
    },
};