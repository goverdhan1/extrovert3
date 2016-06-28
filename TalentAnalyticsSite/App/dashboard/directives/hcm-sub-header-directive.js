'use strict';
angular.module('dashboard').directive("hcmSubHeader", function () {
    return {
        restrict: 'E',
        templateUrl: 'App/dashboard/views/hcm-sub-header-view.html',
        replace: true,
    };
});