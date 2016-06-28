'use strict';
/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>

/// <reference path='testharness.tests.js'/>
/// <reference path='../services/dashboard.constants.js'/>
/// <reference path="../controllers/dashboard.controller.js" />


describe('Dashboard Controller', function () {

    beforeEach(module('dashboard'));

    var scope,
        DashboardConstants;

    beforeEach(inject(function ($rootScope, $controller, _DashboardConstants_) {
        scope = $rootScope.$new();
        DashboardConstants = _DashboardConstants_;
        $controller("DashboardController", {
            $scope: scope,
            DashboardConstants: _DashboardConstants_
        });
    }));

    it("should have the default value set for the active tab", function () {
        expect(scope.tab).toEqual(DashboardConstants.defaultTabIndex);
    });

    it("onTabSelect should be able to set the tab index", function () {
        var testIndex = 4;
        scope.onTabSelect(testIndex);
        expect(scope.tab).toEqual(testIndex);
    });
});
