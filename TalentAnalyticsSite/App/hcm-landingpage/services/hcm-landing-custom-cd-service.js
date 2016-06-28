'use strict';

angular.module('headcountLandingPage').factory('HeadcountLandingCustomDateSelectService', ['GetCacheEnabledResourceService', 'CoreConstants',
  function (GetCacheEnabledResourceService, CoreConstants) {
      var url = CoreConstants.baseHeadcountUrl + "Services/Employee_HCM_Summary_Metrics_CUS_CD.xsodata/HCM_SUMMARY_METRICS_CUS_CDParameters(IP_FILTERNAME=':filterName')/Results?$format=json";
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
