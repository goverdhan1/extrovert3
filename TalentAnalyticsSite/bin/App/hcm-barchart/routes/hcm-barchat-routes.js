'use strict';

angular.module('headcountBarChat').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

      // HeadCountFullView state routing
      $stateProvider
          .state('headcountbarchat', {
              url: '/headcountbarchat',
              parent: 'parent',
              templateUrl: 'App/hcm-barchat/views/hcm-barchatview.html',
        
          })

      //headcountmetricschart

      
  }
]);