'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('my app', function() {

    it('should automatically redirect to /home when location is empty', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).to.eventually.equal("/home");
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