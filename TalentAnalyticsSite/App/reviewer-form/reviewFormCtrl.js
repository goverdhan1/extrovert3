'use strict';

angular.module('extrovertApp').controller('reviewFormCtrl', function ($scope, $rootScope, EmpValue) {

	

	//Method to do default/initialzations
	(function(){
		$rootScope.$broadcast('moduleName','reviewerform');

		$scope.channels = EmpValue.channels;
		$scope.cops = EmpValue.cops;
		$scope.initiativeTypes = EmpValue.initiativeTypes;
		
	})();

});