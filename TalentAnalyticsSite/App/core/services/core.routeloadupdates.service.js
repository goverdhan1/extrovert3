'use strict';

angular.module('core').factory('RouteLoadUpdatesService', function (UserDetails, AnalyticsService, ExportData) {
    return {
        updatesBeforeRouteLoad: function (pageName) {
            ExportData.sections = null;
            AnalyticsService.trackPage(pageName);
        }
    };
});