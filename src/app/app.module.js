(function () {
    'use strict';

    angular.module('angular-seed', [
            'ngAnimate',
            'ngAria',
            'ngMessages',
            'ngResource',
            'ui.bootstrap',
            'ui.router',
            'angular-seed.constants',
            'angular-seed.views'
        ])
        .config(configure)
        .run(run);

    configure.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider'];

    function configure($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
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

    run.$inject = ['$rootScope'];

    function run($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //event.preventDefault();
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
        });
        //$state.go("lazy.state", {a:1, b:2}, {inherit:false});
        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            //console.log(unfoundState.to); // "lazy.state"
            //console.log(unfoundState.toParams); // {a:1, b:2}
            //console.log(unfoundState.options); // {inherit:false} + default options
        });
    }
})();
