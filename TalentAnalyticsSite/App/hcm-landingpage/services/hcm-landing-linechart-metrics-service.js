'use strict';

angular.module('headcountLandingPage').factory('HeadcountLandingLinechartMetricsService', ['GetCacheEnabledResourceService', 'CoreConstants',
  function (GetCacheEnabledResourceService, CoreConstants) {
      var url = CoreConstants.baseHeadcountUrl + "Services/Employee_HCM_Summary_Metrics.xsodata/HCM_SUMMARY_METRICSParameters(FILTER_NAME=':filterName')/Results?$format=json";
      return GetCacheEnabledResourceService.getCacheEnabledResource(url, { filterName: '@filterName' }, {
          'get': {
              method: 'GET',
              withCredentials: true,
              transformResponse: function (data) {
                  return angular.fromJson(data).d;
              }
          }
      });
  }
]);
