const path = require('path');

module.exports = {
    mode: 'development',
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

        ]
    },
};