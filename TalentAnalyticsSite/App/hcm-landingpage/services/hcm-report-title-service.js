'use strict';

angular.module('headcountLandingPage').factory('HeadcountReportTitleService', ['$resource', 'CoreConstants', 'UserDetails',
  function ($resource, CoreConstants, UserDetails) {
      var url = CoreConstants.baseHeadcountUrl + "Services/Employee_HCM_LabelText.xsodata/HCM_LABEL_TEXTParameters(IP_USER_NAME=':userName',IP_FILTER_NAME=':filterName')/Results?$format=json"
      return $resource(url, { userName: UserDetails.userId, filterName: '@filterName' }, {
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