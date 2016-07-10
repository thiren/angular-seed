'use strict';

describe('angularSeed.header module', function() {

    beforeEach(module('angularSeed.header'));

    describe('HeaderCtrl', function(){
        var ctrl;

        beforeEach(inject(function($rootScope, $controller) {
            ctrl = $controller('HeaderCtrl', {});
        }));

        it('should be defined', inject(function() {
            assert.isDefined(ctrl, 'is defined')
        }));
    });
});
