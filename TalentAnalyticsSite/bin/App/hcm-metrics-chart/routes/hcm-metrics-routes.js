'use strict';

angular.module('headCountMatrics').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

      // HeadCountFullView state routing
      $stateProvider
          .state('headcountmatrics', {
              url: '/headcountmetricschat',
              parent: 'parent',
              templateUrl: 'App/hcm-metrics-chat/views/hcm-metrics-view.html',
    
          })

      //headcountmetricschart

      
  }
]);