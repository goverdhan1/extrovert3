'use strict';

angular.module('core').factory('GetCacheEnabledResourceService', function ($resource) {
    return {
        getCacheEnabledResource: getCacheEnabledResource
    };

    function getCacheEnabledResource(url, params, methods) {
        return (function(){
            var service = $resource(url, params, methods);

            var cachedData = null;
            function get() {
                var successHandlerIndex = getSuccessHandlerIndex(arguments.length);
                var successHandler = arguments[successHandlerIndex];
                var errorHandler = arguments[successHandlerIndex + 1];
                var parameters = successHandlerIndex > 0? arguments[successHandlerIndex - 1] : null;
                service.get(parameters, function (data) {
                    cachedData = data;
                    successHandler(cachedData);
                }, function (err) {
                    errorHandler(err);
                });
            }

            function getCached() {
                var successHandlerIndex = getSuccessHandlerIndex(arguments.length);
                var successHandler = arguments[successHandlerIndex];
                if (cachedData) {
                    successHandler(cachedData);
                } else {
                    get.apply(this, arguments);
                }
            }

            function getSuccessHandlerIndex(length) {
                if (length === 2) {
                    return 0;
                } else if (length === 3) {
                    return 1;
                } else {
                    console.error('Invalid argument length');
                }
            }

            return {
                get: get,
                getCached: getCached
            };
        })();
    }
});