'use strict';

angular.module('core').directive('checkImage', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                $http.get(ngSrc).success(function () {
                }).error(function (err) {
                    var errMessage = "Get image error";
                    console.error(errMessage, err);
                    element.attr('src', '../../App/core/images/icon-Employee_Quickview-photo-placeholder@2x.png'); // set default image
                });
            });
        }
    };
});
