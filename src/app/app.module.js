(function () {
    'use strict';

    angular.module('angularSeed', [
            'ngAnimate',
            'ngAria',
            'ngMaterial',
            'ngMessages',
            'ngResource',
            'ui.router',
            'angularSeed.templates',
            'angularSeed.constants',
            'angularSeed.header'
        ])
        .config(configure)
        .run(run);

    configure.$inject = ['$stateProvider', '$compileProvider', '$locationProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', 'configs'];

    function configure($stateProvider, $compileProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider, configs) {
        $compileProvider.debugInfoEnabled(configs.debugInfoEnabled);
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('app', {
                url: "",
                abstract: true,
                views :{
                    "header@": {
                        templateUrl: "header/header.tpl.html",
                        controller: 'HeaderCtrl'
                    },
                    "footer@": {
                        templateUrl: "footer/footer.tpl.html"
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                views: {
                    "content@": {
                        templateUrl: "home/home.tpl.html"
                    }
                }
            });
    }

    run.$inject = ['$rootScope'];

    function run($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

        });

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {

        });

        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {

        });
    }
})();
