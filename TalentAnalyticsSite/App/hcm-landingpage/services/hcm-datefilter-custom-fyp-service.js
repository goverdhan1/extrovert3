'use strict';

angular.module('headcountLandingPage').factory('HeadcountLandingcustomeFicalPeriodService', ['GetCacheEnabledResourceService', 'CoreConstants',
  function (GetCacheEnabledResourceService, CoreConstants) {
      var url = CoreConstants.baseHeadcountUrl + "Services/Employee_HCM_Summary_Metrics_Custom.xsodata/HCM_SUMMARY_METRICS_CUSTOMParameters(IP_FILTER_NAME=':filterName')/Results?$format=json";

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
