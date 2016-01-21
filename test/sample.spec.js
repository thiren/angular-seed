'use strict';

describe('angular-seed module', function() {

    beforeEach(module('angular-seed'));
    beforeEach(module('angular-seed.constants'));
    beforeEach(module('angular-seed.views'));

    describe('header controller', function(){

        it('should ....', inject(function($controller) {
            //spec body
            var view1Ctrl = $controller('headerController');
            expect(view1Ctrl).toBeDefined();
        }));

    });
});
