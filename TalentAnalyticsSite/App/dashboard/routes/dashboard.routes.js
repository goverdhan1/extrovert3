'use strict';

// Setting up route
angular.module('dashboard').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

      // dashboard state routing
      $stateProvider
          .state('dashboard', {
              url: '/dashboard',
              parent: 'parent',
              templateUrl: 'app/dashboard/views/dashboard.html'
          });
  }
]);