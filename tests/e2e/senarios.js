'use strict';

describe('my app', function() {

    it('should automatically redirect to /home when location hash/fragment is empty', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/home");
    });


    describe('home', function() {

        beforeEach(function() {
            browser.get('index.html/home');
        });


        it('should wrap webdriver', function() {
            // Mocha will report the spec as slow if it goes over this time in ms.
            this.slow(6000);
            expect(browser.getTitle()).to.eventually.equal('Angular Seed');
        });
    });
});