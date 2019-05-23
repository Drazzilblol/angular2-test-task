const HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.(html|css)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),

        new CopyPlugin([
            {from: 'src/app/locales/*', to: 'locales', flatten: true},
        ]),
    ]
}