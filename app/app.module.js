(function () {
    'use strict';

    angular.module('angular-seed', [
        'ngMaterial',
        'settings',
        'ui.router',
        'angular-views'
    ])
        .config(configure)
        .run(run);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider'];

    function configure($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        //$urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('app', {
                url: "",
                views: {
                    "main@": {
                        templateUrl: "main.tpl.html"
                    }
                }
            });
    }

    run.$inject = [];

    function run () {

    }
})();
