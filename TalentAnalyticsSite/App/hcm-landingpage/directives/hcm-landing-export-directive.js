'use strict';
angular.module('headcountLandingPage').directive("hcmLandingExport", function () {
    return {
        restrict: 'E',
        templateUrl: 'App/hcm-landingpage/views/hcm-landing-export.html',
        replace: true
    }
});