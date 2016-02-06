(function () {
    "use strict";

    angular.module('angularSeed.header')
        .controller('HeaderCtrl', headerCtrl);

    headerCtrl.$inject = ['$scope'];

    function headerCtrl($scope) {
        $scope.$on('$viewContentLoaded', function(event){
            // fired once the view is loaded, after the DOM is rendered.
        });
        $scope.vm = {
            header: 'Header'
        }
    }
})();