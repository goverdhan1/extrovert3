'use strict';

//Service used for communicating with the a test OData endpoints
angular.module('core').factory('TestHanaConnection', ['$resource', 'CoreConstants',
function ($resource, CoreConstants) {
      var url = CoreConstants.baseHANAUrl + 'Employee.xsodata/EMPLOYEE?$top=1&$format=json';

      return $resource(url, {}, CoreConstants.baseResourceConfiguration);
  }
]);