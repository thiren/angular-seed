(function () {
    'use strict';

    angular.module('angular-seed', [
        'ngAnimate',
        'ngMessages',
        'ui.router',
        'angular-seed.constants',
        'angular-seed.views'
    ])
        .config(configure)
        .run(run);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider'];

    function configure($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise("/home");
        $stateProvider
            .state('app', {
                url: "",
                abstract: true,
                views: {
                    "main@": {
                        templateUrl: "main.tpl.html"
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                views: {
                    "header@app": {
                        templateUrl: "header/header.tpl.html"
                    },
                    "content@app": {
                        templateUrl: "home/home.tpl.html"
                    }
                }
            });
    }

    run.$inject = [];

    function run () {

    }
})();
