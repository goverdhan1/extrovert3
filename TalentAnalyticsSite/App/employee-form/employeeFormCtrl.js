'use strict';

angular.module('extrovertApp').controller('employeeFormCtrl', function ($scope, $rootScope, EmpValue, EmpFormPostService) {

	$scope.details = {};
	$scope.initiatives = [];	

	//To create minimum 5 grid items on fresh load
	(function(){
		$rootScope.$broadcast('moduleName','employeeform');

		$scope.channels = EmpValue.channels;
		$scope.cops = EmpValue.cops;
		$scope.initiativeTypes = EmpValue.initiativeTypes;

		if($scope.initiatives.length < 5){
			for(; $scope.initiatives.length < 5;){
				var initiative = {};

				$scope.initiatives.push(initiative);
			}
		}
	})();

	$scope.addInitiative = function(){
		var initiative = {};

		$scope.initiatives.push(initiative);
	}

	$scope.deleteInitiative = function(index){

		$scope.initiatives.splice(index, 1);
		//var filtered = $scope.initiatives.filter(function(el) { return el.$index != index; }); 
		//$scope.initiatives[index].

	}

	$scope.showValidationAlert = function(){
		//Validate Personal details
		if(!$scope.detailsForm.personalName.$valid ||  !$scope.detailsForm.personalEmail.$valid){
			alert('Please fill Personal Details');
			return false;
		}

		if(!$scope.detailsForm.channel.$valid){
			alert('Please select a Channel');
			return false;
		}		

		//Validate Teamlead details
		if(!$scope.detailsForm.cop.$valid){
			alert('Please select a CoP');
			return false;
		}

		//Validate Coach details
		if(!$scope.detailsForm.coachName.$valid ||  !$scope.detailsForm.coachEmail.$valid){
			alert('Please fill Coach Details');
			return false;
		}

		return true;
	}

	var getPostObj = function(){
		var postObj =		{
			  EMPLOYEE: $scope.details.personalName,
			  EMPLOYEE_EMAIL: $scope.details.personalName,
			  CHANNEL: $scope.details.channel,
			  COP_NAME: $scope.details.cop,
			  LEAD_NAME: $scope.details.leadName,
			  LEAD_EMAIL: $scope.details.leadEmail,
			  COACH_NAME: $scope.details.coachName,
			  COACH_EMAIL: $scope.details.coachEmail,
			  TYPE_OF_INITIATIVE: getStringofArrayAttribute($scope.details.initiatives, 'type'),  
			  NAME_OF_INITIATIVE: getStringofArrayAttribute($scope.details.initiatives, 'name'),
			  HOURS_SPENT: getStringofArrayAttribute($scope.details.initiatives, 'timeSpent'), 	
			  INITIATIVE_LEAD: getStringofArrayAttribute($scope.details.initiatives, 'leadName'),  	
		  	  INITIATIVE_LEAD_EMAIL: getStringofArrayAttribute($scope.details.initiatives, 'leadEmail'),	  		  
	  		  CONTRIBUTION_DETIALS: getStringofArrayAttribute($scope.details.initiatives, 'contributionDetails')		  
			};

		return postObj;			
	}

	var getStringofArrayAttribute = function(arr, attribute){
		var newArr = [];
		angular.forEach(arr, function(item){
			newArr.push(item[attribute] ?  item[attribute]  : "''" );
		});

		return newArr.toString();
	}

	$scope.onSubmit = function() {

		console.log($scope.detailsForm.$valid);
		if($scope.detailsForm.$valid){
			
			$scope.details.initiatives = [];
			angular.forEach($scope.initiatives, function(initiative){
				if(initiative.type){
					$scope.details.initiatives.push(initiative);
				}				
			});
			if($scope.details.initiatives.length < 1){
				alert("Please fill atleast one Initiative");
				return;
			}
			
			var postObj = getPostObj();

			EmpFormPostService.save(postObj).$promise
			.then(function(result){
				console.log('Success on POST: '+result);
			}, function(err){
				console.log('Error on POST: '+err);
			});
		}
		else{
			$scope.showValidationAlert();
		}
	}



});