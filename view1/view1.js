'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [ '$log', '$scope','RestController', function($log, $scope, RestController) {
	
	var latest_rates = RestController.get_latest_rates('USD')
		.then(function(response){
			
			$scope.latest_rates = response.data;
			
			$log.debug($scope.latest_rates);
			$log.debug($scope.latest_rates.rates['AUD'])
		});
	
	$scope.countries = RestController.countries;
	
}]);