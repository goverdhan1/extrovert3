'use strict';
angular.module('headcountLandingPage').controller('HeadcountLandingController',
function ($scope, $timeout, UserDetails, HeadcountManagementFilterPostService, ExportData, toaster, ustageStatistics) {
    var selectedFilter;
    $scope.fileName = '';
    ExportData.filename = "HCM Summary ";
    $scope.lineChartGridHandler = {};
    $scope.isPartialPeriodMessageShow = {
        grid: false,
        graph: false
    };
    $scope.lineChartHandler = {
        selectedFilter: "",
        chartScale: "",
        chartType: "linechart",
        lineChart: true,
        barChart: false
    };    

    $scope.renderLineChart = function (filterName, selectedType) {
        selectedFilter = filterName;
        if ($scope.lineChartHandler.onSelectedFilterChange) {
            $scope.lineChartHandler.onSelectedFilterChange(filterName, selectedType, $scope.getCachedData);
            $scope.getCachedData = false; //reset flag to get the cached data each time
        } else {
            console.error('line chart does not have a filter change handler');
        }
    };

    $scope.setChartType = function (chartType) {
        if (chartType == 'Bar') {
            $scope.lineChartHandler.chartType = 'barchart';
            $scope.lineChartHandler.barChart = true;
            $scope.lineChartHandler.lineChart = false;
        } else {
            $scope.lineChartHandler.chartType = 'linechart';
            $scope.lineChartHandler.lineChart = true;
            $scope.lineChartHandler.barChart = false;
        }
    };

    $scope.toggleChart = function (chartType) {
        if ($scope.multiSave) {
            return;
        }
        var postChartType;
        $scope.getCachedData = true;//do not pull the metrics data again as only the chart type has changed
        switch (chartType) {
            case "barchart":
                ustageStatistics.analyticsValue("HM Summary- Chart Type-Bar Chart|HM_Summary");
                postChartType = 'Bar';
                $scope.lineChartHandler.chartType = 'barchart';
                $scope.lineChartHandler.barChart = true;
                $scope.lineChartHandler.lineChart = false;
                break;
            case "linechart":
                ustageStatistics.analyticsValue("HM Summary- Chart Type-Line Chart|HM_Summary");
                postChartType = 'Line';
                $scope.lineChartHandler.chartType = 'linechart';
                $scope.lineChartHandler.lineChart = true;
                $scope.lineChartHandler.barChart = false;
                break;
            default:
                postChartType = 'Line';
                $scope.lineChartHandler.chartType = 'linechart';
                $scope.lineChartHandler.lineChart = true;
                $scope.lineChartHandler.barChart = false;
                break;
        }
        var lastUsedData = {
            "USER_NAME": UserDetails.userId,
            "FILTER_NAME": selectedFilter,
            "ATTRIBUTENAME_DATE": "",
            "ATTRIBUTE_VALUE": "",
            "DELETE_FLAG": "N",
            "LAST_USED_FLAG": "Y",
            "CHART_TYPE": postChartType
        };
        HeadcountManagementFilterPostService.save(lastUsedData, function (data) {
        }, function (err) {
            // Tracking errors
            var errMessage = "Save last used filter and chart type returned an error";
            console.error(errMessage, err);
            toaster.pop('error', errMessage);
        });

    };

    $scope.postFilterDataCallback = function (selectedFilter, selectedType) {
        angular.element("svg").replaceWith($scope.renderLineChart(selectedFilter, selectedType));
        angular.element(".tooltip").css('opacity', '0');
    };

});
