'use strict';
angular.module('headcountLandingPage').directive("hcmLandingLinechartGrid", function (ExportData) {
    return {
        restrict: 'E',
        templateUrl: 'App/hcm-landingpage/views/hcm-landing-linechart-grid.html',
        scope: {
            handler: '=',
            selectedFilter: '@'
        },
        controller: function ($scope, $timeout) {
            $scope.Math = window.Math;
            $scope.handler.onRangeChange = function (newRangeValues) {
                   $scope.pdfgriddata = ExportData.selectedData;
                   ExportData.rangevalues = $scope.rangevalues = angular.copy(newRangeValues);
                
                $timeout(function () {
                    $scope.$digest(function () {

                        $scope.rangevalues = angular.copy(newRangeValues);
                    });

                }, 0);
                $scope.seletedDropValue = $scope.selectedFilter;
            };
        },
        link: function (scope, element, attrs) {

        },
        replace: true
    }
});