/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>

/// <reference path="../../core/tests/testharness.tests.js" />
/// <reference path="../../header/tests/testharness.tests.js" />
/// <reference path='testharness.tests.js'/>
/// <reference path="../../core/services/core.constants.js" />

/// <reference path="../../header/services/userdetails.value.js" />

/// <reference path="../services/hcm-landing-linechart-metrics-service.js" />

describe('Headcount landing linechart metrics service', function () {

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('headcountLandingPage'));
    //beforeEach(module('header'));

    var $httpBackend;
    var CoreConstants;
    var HeadcountLandingLinechartMetricsService;
    var UserDetails;

    // Wrap the parameter in underscores
    beforeEach(inject(function (
        _$httpBackend_,
        _CoreConstants_,
        _UserDetails_,
        _HeadcountLandingLinechartMetricsService_
        ) {
        $httpBackend = _$httpBackend_;
        CoreConstants = _CoreConstants_;
        UserDetails = _UserDetails_;
        UserDetails.userId = 'USERID';
        HeadcountLandingLinechartMetricsService = _HeadcountLandingLinechartMetricsService_;

    }));

    it('Should be capable of returning data through the get protocol', function () {

        var returnValue = '{"returnedValue":"1"}';

        var filterName = 'filterNameMock';

        //mock http service
        $httpBackend.expectGET(CoreConstants.baseHeadcountUrl +
            "Services/Employee_HCM_Summary_Metrics.xsodata/HCM_SUMMARY_METRICSParameters(FILTER_NAME='" + filterName +"')/Results?$format=json")
                .respond('{ "d": ' + returnValue + '}');

        HeadcountLandingLinechartMetricsService.get({ filterName: filterName }, function (response) {
            expect(JSON.stringify(response)).toEqual(returnValue);
        });

        //flush mock http service to return get results
        $httpBackend.flush();

    });
});
