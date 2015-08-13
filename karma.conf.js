// Karma configuration
// Generated on Mon Jul 27 2015 12:17:38 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'static/bower_components/angularjs/angular.js',
            'static/bower_components/angular-route/angular-route.js',
            'static/bower_components/angular-mocks/angular-mocks.js',
            'static/bower_components/ladda/dist/spin.min.js',
            'static/bower_components/ladda/dist/ladda.min.js',
            'static/bower_components/angular-ladda/dist/angular-ladda.min.js',
            'static/bower_components/angular-sanitize/angular-sanitize.js',
            'static/bower_components/angular-bootstrap-confirm/src/ui-bootstrap-position.js',
            'static/bower_components/angular-bootstrap-confirm/dist/angular-bootstrap-confirm.min.js',
            'static/app/main.js',
            'static/app/filters.js',
            'static/app/cloudfoundry.js',
            'static/app/controllers.js',
            'static/tests/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'static/app/*': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        coverageReporter: {
            type: 'json',
            dir: 'coverage',
            subdir: '.'
        }

    })
}
