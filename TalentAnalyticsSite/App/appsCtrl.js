'use strict';

angular.module('extrovertApp').controller('appsCtrl', function ($scope, appsService) {

appsService.get(function(response){
$scope.apps=response;
}, function(error){

	$scope.apps=error;

})


});