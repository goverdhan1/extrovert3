'use strict';

// dashboard Controller
angular.module('dashboard').controller('DashboardController', ['$scope', 'DashboardConstants', 'CoreConstants', 'CoreFunctions', '$stateParams', '$window',
  function ($scope, DashboardConstants, CoreConstants, CoreFunctions, $stateParams, $window) {

      alert("hi")

      $scope.tiles = DashboardConstants.tiles;
      if ($stateParams.tabIndex && $stateParams.tabIndex.length) {
          $scope.tab = Number($stateParams.tabIndex);
      } else {
          $scope.tab = DashboardConstants.defaultTabIndex;
      }

      $scope.onTabSelect = function (tabIndex) {
          if (DashboardConstants.defaultTabIndex === tabIndex) {
              $scope.tab = tabIndex;
          } else {
              $window.location.href = "../#!/?tabIndex=" + tabIndex;
          }
      };

      $scope.IntakeFormLink = DashboardConstants.intakeFormLink;

      $scope.SOBSTalentLink = CoreConstants.SOBSTalentLink;

      $scope.redirect = function (url) {
          window.open(url, '_blank');
      }

  }]);