'use strict';

describe('angularSeed.header module', function() {

    beforeEach(module('angularSeed.header'));

    describe('HeaderCtrl', function(){
        var scope, ctrl;

        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('HeaderCtrl', {$scope: scope});
        }));

        it('should be defined', inject(function() {
            assert.isDefined(ctrl, 'is defined')
        }));
    });
});
