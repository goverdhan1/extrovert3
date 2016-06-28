'use strict';
angular.module('headcountLandingPage').directive("hcmLandingBarchartGrid", function () {
    return {
        restrict: 'E',
        templateUrl: 'App/hcm-landingpage/views/hcm-landing-barchart-grid.html',
        scope: {
            handler: '=',
            selectedFilter: '@'
        },
        controller: function ($scope, $timeout) {

        },
        link: function (scope, element, attrs) {

        },
        replace: true
    }
});