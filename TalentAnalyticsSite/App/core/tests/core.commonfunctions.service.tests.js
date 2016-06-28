/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>


/// <reference path='testharness.tests.js'/>
/// <reference path="../services/core.commonfunctions.service.js" />
/// <reference path="../services/core.constants.js" />

describe('core common functions service', function () {

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('core'));

    var CoreFunctions;
    var CoreConstants;

    // Wrap the parameter in underscores
    beforeEach(inject(function (_CoreFunctions_, _CoreConstants_) {
        CoreFunctions = _CoreFunctions_;
        CoreConstants = _CoreConstants_;
    }));


    it('Should format a string replacing argument placeholders', function () {

        var formatted = CoreFunctions.getFormattedString("{0} and {1}", 1, 2);
        expect(formatted).toEqual("1 and 2");
    });

    it('Should generate link to profile', function () {
        var employeeUserId = 'mockRmployeeUserId';
        var link = CoreFunctions.getDPNProfileLink(employeeUserId);
        var expectedLink = CoreConstants.baseDPNProfile + 'profile/' + employeeUserId.toLowerCase();
        expect(link).toEqual(expectedLink);
    });

    xit('Should generate a bonus link', function () {
        var employeeUserId = 'mockRmployeeUserId';
        var flag = 'mockFlag';
        var link = CoreFunctions.getBonusLink(employeeUserId, flag);
        var expectedLink = 'https://qqlikview.deloitte.com/QvAJAXZfc/';
        expect(link).toEqual(expectedLink);

    });
});
