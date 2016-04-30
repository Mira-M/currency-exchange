'use strict';

angular.module('myApp.ConversionController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/conversion', {
    templateUrl: 'ConversionController/conversion.html',
    controller: 'ConversionCtrl'
  });
}])

.controller('ConversionCtrl', [ '$filter', '$log', '$scope','RestController', 'ViewController', function($filter, $log, $scope, RestController, ViewController) {
	
	
	$scope.set_base_country = function (base_country){
		$scope.base = base_country;
	};
	
	$scope.set_destination_country = function (destination_country){
		$scope.destination = destination_country;
	};
	
	$scope.get_base_rate = function (base_country){
		$log.debug("Entering get_base_rate()");
		$scope.instant_base_display = undefined;
		$scope.conversion = undefined;
		$scope.base_display_message = undefined;
		$scope.base_display_number = undefined;
		
		
		base_country = $filter('uppercase')(base_country);
		$log.debug(base_country);
		
		if (base_country !== undefined){
			var included = $filter('filter')($scope.countries, {$:base_country});
			$log.debug(included);
			
			var valid = base_country.length === 3;
			
			if (!valid){
				$scope.instant_base_display = "Country Code must be 3 characters."
			}
			
			if (included === undefined){
				$scope_instant_base_display = base_country + " is not in our database."
			}
			
			
			if (included !== undefined && valid){
				$log.debug("DEFINED");
				
				RestController.get_current_rate(base_country)
					.then(function(response){
						$scope.current_rate = response.data;
						$log.debug('$scope.current_rate');
						$log.debug($scope.current_rate);
						$scope.parse_country = $scope.current_rate.rates[base_country];
						
						if ($scope.parse_country !== undefined){
							$scope.instant_base_display = $scope.parse_country;
						}
						
						if (angular.isNumber($scope.instant_base_display)){
							$scope.base_display_number = 1.00;
						} else {
							$scope.base_display_message = "Results for this country not available."
						}
				});
			};
		};

	};
	
	$scope.get_destination_rate = function (destination_country){
		$log.debug("Entering get_base_rate()");
		$scope.instant_destination_display = undefined;
		$scope.conversion = undefined;
		
		destination_country = $filter('uppercase')(destination_country);
		$log.debug(destination_country);
		
		if (destination_country !== undefined){
			var included = $filter('filter')($scope.countries, {$:destination_country});
			$log.debug(included);
			
			var valid = destination_country.length === 3;
			
			if (!valid){
				$scope.instant_destination_display = "Country Code must be 3 characters."
			}
			
/*
			if (included === undefined){
				$scope.instant_destination_display = base_country + " is not in our database."
			}
*/
			
			if (included !== undefined && valid){
				$log.debug("DEFINED");
				
				RestController.get_current_rate(destination_country)
					.then(function(response){
						$scope.current_rate = response.data;
						$log.debug('$scope.current_rate');
						$log.debug($scope.current_rate);
						$scope.parse_country = $scope.current_rate.rates[destination_country];
						
						if ($scope.parse_country !== undefined){
							$scope.instant_destination_display = $scope.parse_country;
						} else {
							//THROW SOME EXCEPTION HERE, MODAL WITH SOMETHING OR SOMETHING
							$scope.instant_destination_display = "Results for this country not available."
						}	
				});
			};
		};

	};
	
	$scope.get_conversion = function(base, destination){
		
		var invalid = angular.equals(base, destination);
		
		if (invalid){
			
			$scope.conversion = "Choose a different destination country and resubmit."
			
		};
		
		if (!invalid){
			RestController.get_latest_rates(base)
				.then(function(response){
			
				var latest_rates = response.data;
				$scope.conversion = latest_rates.rates[destination];
				
				

			});
		}
		
	};
	

	$scope.countries = ViewController.countries;
	$scope.footer_text = ViewController.footer_text;
}]);