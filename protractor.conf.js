exports.config = {
    directConnect: false,

    allScriptsTimeout: 11000,

    specs: [
        './tests/e2e/**/*.js'
    ],

    capabilities: {
        browserName: 'firefox'
    },

    baseUrl: 'http://localhost:9000',

    seleniumAddress: 'http://localhost:4444/wd/hub',

    onPrepare: function() {
        // Disable animations so e2e tests run more quickly
        var disableNgAnimate = function() {
            angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
                $animate.enabled(false);
            }]);
        };

        browser.addMockModule('disableNgAnimate', disableNgAnimate);
    },

    framework: 'mocha',

    mochaOpts: {
        reporter: 'spec',
        timeout: 4000
    }
};