'use strict';
angular.module('headcountLandingPage').directive("hcmLandingBarchart", function (HeadcountLandingLinechartMetricsService, HeadcountLandingLinechartPreviousYearMetricsService) {
    return {
        restrict: 'E',
        templateUrl: 'App/hcm-landingpage/views/hcm-landing-barchart.html',
        scope: {
            onDateRangeChange: '&',
            selectedFilter: '@',
            renderChart: '&',
            lineChart: '='
        },
        controller: function ($scope) {
        },
        link: function (scope, element, attrs) {
        },
        replace: true
    }
});