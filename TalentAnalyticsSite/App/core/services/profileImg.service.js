'use strict';

//Service used for communicating with the a Deloitte People Network.
angular.module('core').factory('profileImg', ['$resource', 'CoreConstants',
  function ($resource, CoreConstants) {

      var url = CoreConstants.baseHANAUrl + "Services/Employee_QV_Left_Summary_Screen.xsodata/EMPLOYEE_QV_LEFT_SUMMARY_SCREENParameters(IP_PGEPERSID='00100162')/Results?$format=json";

      return $resource(url, {}, {
          //'get': {
          //    method: 'GET',
          //    withCredentials: true
          //},
          'query': {
              method: 'GET',
              withCredentials: true
          }
      });
  }
]);