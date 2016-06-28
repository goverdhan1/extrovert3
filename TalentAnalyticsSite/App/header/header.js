'use strict';

angular.module('extrovertApp').directive("supportViewHeader", function () {

	
	return {
		controller: function($scope){
			$scope.moduleName = '';
		},				
		link: function(scope, ele, attrs){
			//Set Header
			scope.$on('moduleName', function(event, args){				
				if(args == 'employeeform'){
					scope.moduleName = 'Employee Form';
				}
				else if(args == 'reviewerform'){
					scope.moduleName = 'REVIEWER FORM';
				}
			});
		},
		restrict:'C',
		replace:false,
		templateUrl: 'app/header/header.html'
	}
});