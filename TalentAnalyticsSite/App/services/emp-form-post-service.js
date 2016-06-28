'use strict';

angular.module('extrovertApp').factory('EmpFormPostService', function ($resource) {

      var url = "https://ushdbhwd.deloitte.com/deloitte/hr/app-talent-analytics/app-talent-hcm/Services/Employee_HCM_POST_EMP_FORM.xsodata/PostEmp";

      return $resource(url, {
      }, {
          'save': {
              method: 'POST',
              withCredentials: true
          }
      });
  }
);