'use strict';

angular.module('myApp.HistoricalController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider)
{
  $routeProvider.when('/historical', {
    templateUrl: 'HistoricalController/historical.html', 
    controller: 'HistoricalCtrl'
  });
  
}])

.controller('HistoricalCtrl', ['$filter','$log', '$scope', 'RestController', 'ViewController',
      function($filter, $log, $scope, RestController, ViewController){
        
  	// set the value of the base county from user selection
	$scope.set_base_country = function (base_country){
		$scope.base = base_country;
	};
	
	$scope.set_date = function (date){
		$scope.date = $scope.dt;
		$log.debug($scope.date);
	};
	
	var pad = function(n){return n<10 ? '0'+n : n};
	
	$scope.get_historical = function(){
	  $log.debug("Entering Get Historical");
	
	  // get the rates based on the histocial date from user input
		if ($scope.base !== undefined && $scope.date !== undefined){
			
			$scope.date = $filter('date')($scope.date, 'yyyy-MM-dd');
			
			$log.debug($scope.date);
			
			RestController.get_previous_rates($scope.date, $scope.base)
				.then(function(response){
					$scope.previous_rate = response.data;
					$scope.historical = $scope.previous_rate.rates[$scope.base];
					
					if ($scope.historical === undefined){
						$scope.modalInstance();
					}
  				
	  				// calculate the percentage of change from historical date
	  				$scope.percentage = (($scope.historical - $scope.instant_base_display) / $scope.historical) * 100;
	  				
	  				$log.debug($scope.previous_rate);
	  				$log.debug($scope.historical);
				});
		};
		
		if ($scope.base !== undefined){
			RestController.get_current_rate($scope.base)
				.then(function(response){
					$scope.current_rate = response.data;
					$scope.instant_base_display = $scope.current_rate.rates[$scope.base];
			});
		};
		
		if ($scope.date !== undefined){
			$scope.instant_date_display = $scope.date;
		};	
	};
	
	// pull country list from the ViewController
	$scope.countries = ViewController.countries;
	$scope.footer_text = ViewController.footer_text;
	
	
//------------------------------ MODAL ---------------------------------------

/*
var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'HistoricalController/error.html',
      controller: 'HistoricalCtrl',
      size: 'sm',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
*/	
		
//------------------------------ DATE PICKER ---------------------------------	
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
	  $log.debug('entering clear');
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(1998, 12, 31),
    showWeeks: false
  };
  
  var next_day = new Date();
  next_day.setDate(next_day.getDate() + 1)
  
  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: next_day,
    startingDay: 0
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    //$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'YYYY-MM-DD'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
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
  
  $log.debug($scope.dt);
  
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

