/// <reference path='../../../Scripts/angular.min.js'/>
/// <reference path='../../../Scripts/angular-resource.min.js'/>
/// <reference path='../../../Scripts/angular-mocks.js'/>

/// <reference path="../../core/tests/testharness.tests.js" />
/// <reference path="../../header/tests/testharness.tests.js" />
/// <reference path='testharness.tests.js'/>
/// <reference path="../../core/services/core.constants.js" />

/// <reference path="../../header/services/userdetails.value.js" />

/// <reference path="../controllers/hcm-landing-controller.js" />

describe('Headcount landing Controller', function () {

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('headcountLandingPage'));
    //beforeEach(module('header'));

    var scope;

    // Wrap the parameter in underscores
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller("HeadcountLandingController", {
            $scope: scope
        });


    }));

    it("Should create local variable", function () {
        expect(scope.fileName).toBeDefined();
        expect(scope.fileName).toEqual(jasmine.any(String));
        expect(scope.lineChartGridHandler).toBeDefined();
        expect(scope.lineChartGridHandler).toEqual(jasmine.any(Object));
        expect(scope.lineChartHandler).toBeDefined();
        expect(scope.lineChartHandler).toEqual(jasmine.any(Object));

        expect(scope.lineChartHandler.selectedFilter).toBeDefined();
        expect(scope.lineChartHandler.selectedFilter).toEqual(jasmine.any(String));
        expect(scope.lineChartHandler.chartScale).toBeDefined();
        expect(scope.lineChartHandler.chartScale).toEqual(jasmine.any(String));
        expect(scope.lineChartHandler.chartType).toBeDefined();
        expect(scope.lineChartHandler.chartType).toEqual("linechart");
        expect(scope.lineChartHandler.lineChart).toBeDefined();
        expect(scope.lineChartHandler.lineChart).toEqual(true);
        expect(scope.lineChartHandler.barChart).toBeDefined();
        expect(scope.lineChartHandler.barChart).toEqual(false);

        //expect(scope.onLineChartDateRangeChange).toBeDefined();
        //expect(scope.onLineChartDateRangeChange).toEqual(jasmine.any(Function));
        expect(scope.renderLineChart).toBeDefined();
        expect(scope.renderLineChart).toEqual(jasmine.any(Function));
        expect(scope.toggleChart).toBeDefined();
        expect(scope.toggleChart).toEqual(jasmine.any(Function));

    });

    it("Should call onRangeChange when onLineChartDateRangeChange called", function () {
        var isOnRangeChangeInduced = false;
        var onRangeChangeParam;
        var testParam = 'test';

        scope.lineChartGridHandler.onRangeChange = function (param) {
            isOnRangeChangeInduced = true;
            onRangeChangeParam = param;
        };
        //scope.onLineChartDateRangeChange(testParam);

        expect(isOnRangeChangeInduced).toEqual(true);
        expect(onRangeChangeParam).toEqual(testParam);

    });

    it("Should call onSelectedFilterChange when renderLineChart called", function () {
        var isOnSelectedFilterChangeInduced = false;
        var onSelectedFilterParams;
        var testParam = 'test';

        scope.lineChartHandler.onSelectedFilterChange = function (param) {
            isOnSelectedFilterChangeInduced = true;
            onSelectedFilterParams = param;
        };

        scope.renderLineChart(testParam);

        expect(isOnSelectedFilterChangeInduced).toEqual(true);
        expect(onSelectedFilterParams).toEqual(testParam);
    });

    it("Should toggle chart type", function () {
        scope.toggleChart('');
        expect(scope.lineChartHandler.chartType).toEqual('linechart');
        expect(scope.lineChartHandler.barChart).toEqual(false);
        expect(scope.lineChartHandler.lineChart).toEqual(true);

        scope.toggleChart('barchart');
        expect(scope.lineChartHandler.chartType).toEqual('barchart');
        expect(scope.lineChartHandler.barChart).toEqual(true);
        expect(scope.lineChartHandler.lineChart).toEqual(false);

        scope.toggleChart('linechart');
        expect(scope.lineChartHandler.chartType).toEqual('linechart');
        expect(scope.lineChartHandler.barChart).toEqual(false);
        expect(scope.lineChartHandler.lineChart).toEqual(true);

    });


});
