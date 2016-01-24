'use strict';

describe('angular-seed module', function() {

    beforeEach(module('angular-seed.header'));
    //beforeEach(module('angular-seed.constants'));
    //beforeEach(module('angular-seed.views'));
    //beforeEach(module('angular-seed.header'));

    describe('HeaderController', function(){
        var scope, ctrl;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('HeaderController', {$scope: scope});
        }));

        it('should exist', inject(function($controller) {
            //spec body
            var ctrl = $controller('HeaderController', {$scope: scope});
            expect(ctrl).to.exist;
        }));
    });
});
