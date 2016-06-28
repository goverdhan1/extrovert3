/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>


/// <reference path='testharness.tests.js'/>
/// <reference path='../services/core.constants.js'/>
/// <reference path='../services/testhanaconnection.service.js'/>

describe('core testhanaconnection service', function () {

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('core'));

    var TestHanaConnection;
    var $resource;
    var $httpBackend;
    var CoreConstants;

    it('Should be capable of returning data through the get protocol', function () {

        // Wrap the parameter in underscores
        beforeEach(inject(function (_$httpBackend_,  _CoreConstants_, _TestHanaConnection_) {
            $httpBackend = _$httpBackend_;
            CoreConstants = _CoreConstants_;
            TestHanaConnection = _TestHanaConnection_;
        }));

        var returnValue = '{"returnedValue":"1"}';
        $httpBackend.expectGET(CoreConstants.baseHANAUrl + 'Employee.xsodata/EMPLOYEE?$top=1&$format=json').respond(returnValue);

        TestHanaConnection.get({}, function (response) {
            expect(JSON.stringify(response)).toEqual(returnValue);
        });

        $httpBackend.flush();
    });
});
