'use strict';

angular.module('myApp.HistoricalController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider)
{
  $routeProvider.when('/historical', {
    templateUrl: 'HistoricalController/historical.html', 
    controller: 'HistoricalCtrl'
  });
  
}])

.controller('HistoricalCtrl', ['$log', '$scope', 'RestController', 'ViewController',
      function($log, $scope, RestController, ViewController){
        
  	// set the value of the base county from user selection
	$scope.set_base_country = function (base_country)
	{
		$scope.base = base_country;
	};
	
	$scope.get_historical = function()
	{
	  $log.debug("Entering Get Historical");
	
	  // get the rates based on the histocial date from user input
		if ($scope.base != undefined && $scope.date != undefined)
		{
			RestController.get_previous_rates($scope.base, $scope.date)
				.then(function(response)
				{
					$scope.previous_rate = response.data;
					$scope.historical = $scope.previous_rate.rates[$scope.base];
					$scope.instant_base_display = $scope.previous_rate.rates[$scope.base];
  				
	  				// calculate the percentage of change from historical date
			      $scope.percentage = $scope.current_rate.rates[$scope.base] / $scope.previous_rate[$scope.base];
	  				
	  				$log.debug($scope.previous_rate);
	  				$log.debug($scope.historical);
				});
		}	
		
		if ($scope.base != undefined)
		{
			RestController.get_current_rate($scope.base)
				.then(function(response)
				{
					$scope.current_rate = response.data;
			  	});
		}
			
	};
	
	// pull country list from the ViewCountroller
	$scope.countries = ViewController.countries;
  
  
  
  //Datepicker code starts here
  //Delete this if it interferes with anything from the historical controller
  $scope.today = function() {
    $scope.dt = new Date();
  };
  
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.options = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.options.minDate = $scope.options.minDate ? null : new Date();
  };

  $scope.toggleMin();

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
}]);

