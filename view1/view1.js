'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [ '$log', '$scope','RestController', function($log, $scope, RestController) {
	
	$scope.set_destination_country = function (destination_country){
		$scope.destination = destination_country;
	};
	
	$scope.set_base_country = function (base_country){
		$scope.base= base_country;
	};
	
/*
		RestController.get_latest_rates(base_country)
		.then(function(response){
			
			$scope.latest_rates = response.data;
			
			$log.debug($scope.latest_rates);
			$log.debug($scope.latest_rates.rates['AUD'])
		});
*/

	
	$scope.countries = RestController.countries;
	
}]);