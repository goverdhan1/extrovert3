'use strict';
angular.module('core').directive('preloader', function ($timeout, $parse) {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        scope : {
            'loading': '=',
            'error': '='
        },
        templateUrl: 'App/core/directives/preloader/preloader.html',
        link : function(scope, element){                
            //scope.debugEnabled = initconstants.debugEnabled
            scope.isDetailsCollapsed = true
}
    };
});