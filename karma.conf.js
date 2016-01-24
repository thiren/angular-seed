module.exports = function(config){
    config.set({
        frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

        basePath : './',

        files : [
            'bower_components/angular/angular.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/configs/**/*.js',
            'src/app/**/*.js',
            'src/app/**/*.spec.js',
            'tests/unit/**/*.spec.js'
        ],

        exclude: [
            'src/app/app.module.js'
        ],

        //logLevel: config.LOG_DEBUG,

        preprocessors: {
            'src/app/**/*.js': ['coverage']
        },

        reporters: ['mocha', 'coverage'],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests on file changes
        autoWatch : false,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        browsers : ['PhantomJS2'],

        concurrency: 1,

        plugins : [
            'karma-phantomjs2-launcher',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai',
            'karma-sinon',
            'karma-sinon-chai',
            'karma-coverage'
        ]
    });
};
