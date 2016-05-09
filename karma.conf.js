module.exports = function(config){
    config.set({
        frameworks: ['mocha', 'chai', 'sinon'],

        basePath : './',

        files : [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'temp/**/*.js',
            'src/app/app.module.js',
            'src/app/**/*.module.js',
            'src/app/**/*.js',
            'src/app/**/*.spec.js',
            'test/unit/**/*.spec.js'
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

        browsers : ['PhantomJS'],

        concurrency: 1,

        plugins : [
            'karma-phantomjs-launcher',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai',
            'karma-sinon',
            'karma-coverage'
        ]
    });
};
