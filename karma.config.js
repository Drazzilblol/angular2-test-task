const webpackConf = require("./webpack.test");

module.exports = config => {
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            {pattern: './karma.test.js', watched: false},
        ],

        preprocessors: {
            './karma.test.js': ['webpack']
        },

        webpack: webpackConf,
        reporters: ['progress'],
        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: true
    })

};