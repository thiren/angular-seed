'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('no protractor at all', function() {
    it('should still do normal tests', function() {
        expect(true).to.equal(true);
    });
});

describe('protractor library', function() {
    it.skip('should be able to skip tests', function() {
        expect(true).to.equal(false);
    });

    it('should expose the correct global variables', function() {
        expect(protractor).to.exist;
        expect(browser).to.exist;
        expect(by).to.exist;
        expect(element).to.exist;
        expect($).to.exist;
    });

    it('should be able to redirect', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).to.eventually.equal("/home");
    });

    it('should wrap webdriver', function() {
        // Mocha will report the spec as slow if it goes over this time in ms.
        this.slow(6000);
        browser.get('index.html');
        expect(browser.getTitle()).to.eventually.equal('Angular Seed');
    });
});
