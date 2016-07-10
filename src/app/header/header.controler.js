(function () {
    "use strict";

    angular.module('angularSeed.header')
        .controller('HeaderCtrl', headerCtrl);

    headerCtrl.$inject = [];

    function headerCtrl() {
        var vm =  this;
        
        vm.header = 'Header';
    }
})();
