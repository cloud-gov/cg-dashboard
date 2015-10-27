// Karma configuration
// Generated on Mon Jul 27 2015 12:17:38 GMT-0400 (EDT)

var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
      browsers: ['PhantomJS2', 'Chrome'],

      frameworks: ['jasmine', 'jasmine-matchers', 'sinon', 'phantomjs-shim'],

      files: [ './static_src/tests.bundle.js' ],

      exclude: [],

      plugins: [
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-jasmine-matchers',
        'karma-phantomjs2-launcher',
        'karma-phantomjs-shim',
        'karma-sinon',
        'karma-sourcemap-loader',
        'karma-webpack',
      ],

      preprocessors: {
        'static_src/tests.bundle.js': [ 'webpack']
      },

      webpack: webpackConfig,

      reporters: ['progress'],

      port: 9876,

      colors: true,

      logLevel: config.LOG_INFO,

      autoWatch: true,

      singleRun: false

    })
}
