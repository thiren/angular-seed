exports.config = {
    directConnect: false,

    allScriptsTimeout: 11000,

    specs: [
        './test/e2e/**/*.js'
    ],

    capabilities: {
        browserName: 'chrome'
    },

    baseUrl: 'http://localhost:8080',

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
