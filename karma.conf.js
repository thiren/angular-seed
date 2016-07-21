module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai', 'sinon'],

        basePath: './',

        files: [
            'temp/vendor.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'temp/templates.js',
            'temp/main.js',
            'src/app/**/*.spec.js',
            'test/unit/**/*.spec.js'
        ],

        exclude: [],

        //logLevel: config.LOG_DEBUG,

        preprocessors: {
            'temp/main.js': ['coverage']
        },

        reporters: ['mocha', 'coverage'],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'text-summary', subdir: '.', file: 'text-summary.txt'}
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests on file changes
        autoWatch: false,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        browsers: ['PhantomJS'],

        concurrency: 1,

        plugins: [
            'karma-phantomjs-launcher',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai',
            'karma-sinon',
            'karma-coverage'
        ]
    });
};
