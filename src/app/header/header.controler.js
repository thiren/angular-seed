(function () {
    "use strict";

    angular.module('angular-seed.header')
        .controller('HeaderController', controller);

    controller.$inject = ['$scope'];

    function controller($scope) {
        $scope.vm = {
            header: 'Header'
        }
    }
})();