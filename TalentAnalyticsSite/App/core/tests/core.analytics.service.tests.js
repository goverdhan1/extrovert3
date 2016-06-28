/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>


/// <reference path="../../header/tests/testharness.tests.js" />
/// <reference path='testharness.tests.js'/>
/// <reference path="../services/core.analytics.service.js" />
/// <reference path="../services/core.constants.js" />


/// <reference path="../../header/services/userdetails.value.js" />

describe('core common functions service', function () {

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('core'));

    var $rootScope;
    var AnalyticsService;
    var CoreConstants;
    var UserDetails;

    var userId = 'testUserID';
    var testPage = 'testPage';

    // Wrap the parameter in underscores
    beforeEach(inject(function (_$rootScope_, _AnalyticsService_, _CoreConstants_, _UserDetails_) {
        $rootScope = _$rootScope_;
        AnalyticsService = _AnalyticsService_;
        CoreConstants = _CoreConstants_;
        UserDetails = _UserDetails_;
    }));

    it('Should set a property on UserDetails', function () {
        AnalyticsService.trackPage(testPage);
        expect($rootScope.analyticsDataToSend).toBeUndefined();
        expect(UserDetails.analyticsDataToSend).toBeDefined();
        expect(UserDetails.analyticsDataToSend).toEqual(jasmine.any(Object));
        expect(UserDetails.analyticsDataToSend.pageName).toBeDefined();
        expect(UserDetails.analyticsDataToSend.pageName).toEqual(testPage);
        expect(UserDetails.analyticsDataToSend.title).toBeDefined();
        expect(UserDetails.analyticsDataToSend.title).toEqual("Employee Quickview");
    });

    it('Should set a rootscope property', function () {
        UserDetails.userId = userId;
        AnalyticsService.trackPage(testPage);
        expect($rootScope.analyticsDataToSend).toBeDefined();
        expect($rootScope.analyticsDataToSend).toEqual(jasmine.any(Object));
        expect($rootScope.analyticsDataToSend.pageName).toBeDefined();
        expect($rootScope.analyticsDataToSend.pageName).toEqual(testPage);
        expect($rootScope.analyticsDataToSend.title).toBeDefined();
        expect($rootScope.analyticsDataToSend.title).toEqual("Employee Quickview");
        expect($rootScope.analyticsDataToSend.userId).toBeDefined();
        expect($rootScope.analyticsDataToSend.userId).toEqual(userId);
    });

});
