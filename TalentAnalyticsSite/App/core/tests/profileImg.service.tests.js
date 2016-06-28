/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>


/// <reference path='testharness.tests.js'/>
/// <reference path='../services/core.constants.js'/>
/// <reference path="../services/profileImg.service.js" />


describe('core profilelmg service', function () {

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('core'));

    var profileImg;
    var $resource;
    var $httpBackend;
    var CoreConstants;

    it('Should be capable of returning data through the get protocol', function () {

        // Wrap the parameter in underscores
        beforeEach(inject(function (_$httpBackend_, _$resource_, _CoreConstants_, _profileImg_) {
            $httpBackend = _$httpBackend_;
            $resource = _$resource_;
            CoreConstants = _CoreConstants_;
            profileImg = _profileImg_;
        }));

        var returnValue = '{"returnedValue":"1"}';
        $httpBackend.expectGET(CoreConstants.baseHANAUrl + "Services/Employee_QV_Left_Summary_Screen.xsodata/EMPLOYEE_QV_LEFT_SUMMARY_SCREENParameters(IP_PGEPERSID='00100162')/Results?$format=json").respond(returnValue);
        profileImg.query({}, function (response) {
            expect(JSON.stringify(response)).toEqual(returnValue);
        });

        $httpBackend.flush();
    });
});
