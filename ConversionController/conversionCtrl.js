'use strict';

angular.module('myApp.ConversionController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/conversion', {
    templateUrl: 'ConversionController/conversion.html',
    controller: 'ConversionCtrl'
  });
}])

.controller('ConversionCtrl', [ '$log', '$scope','RestController', 'ViewController', function($log, $scope, RestController, ViewController) {
	
	$scope.set_destination_country = function (destination_country){
		$scope.destination = destination_country;
	};
	
	$scope.set_base_country = function (base_country){
		$scope.base = base_country;
	};
	
	$scope.get_conversion = function(){
		$log.debug("Entering Get Conversion");
		
		if ($scope.base != undefined && $scope.destination != undefined){
			
			RestController.get_latest_rates($scope.base)
				.then(function(response){
			
				$scope.latest_rates = response.data;
				$scope.conversion = $scope.latest_rates.rates[$scope.destination];
				
				$log.debug($scope.latest_rates);
				$log.debug($scope.conversion);
			});
		};	
		
		if ($scope.base != undefined){
			
			RestController.get_current_rate($scope.base)
				.then(function(response){
					$scope.current_rate = response.data;
					$scope.instant_base_display = $scope.current_rate.rates[$scope.base];
			});
		};	
		
		if ($scope.destination != undefined){
			
			RestController.get_current_rate($scope.destination)
				.then(function(response){
					$scope.current_rate = response.data;
					$scope.instant_destination_display = $scope.current_rate.rates[$scope.destination];
			});
		};	
	};
	
	$scope.countries = ViewController.countries;
	
}]);