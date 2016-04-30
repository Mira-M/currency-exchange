'use strict';

angular.module('myApp.HistoricalController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider)
{
  $routeProvider.when('/historical', {
    templateUrl: 'HistoricalController/historical.html', 
    controller: 'HistoricalCtrl'
  });
  
}])

.controller('HistoricalCtrl', ['$uibModal','$filter','$log', '$scope', 'RestController', 'ViewController',
      function($uibModal, $filter, $log, $scope, RestController, ViewController){
        
  	// set the value of the base county from user selection
	$scope.set_base_country = function (base_country){
		$scope.base = base_country;
		$scope.get_base_rate(base_country);
	};
	
	$scope.testing = function(info){
		$log.debug("Testing");
		$log.debug(info);
	};
	
	$scope.get_base_rate = function (base_country){
		$log.debug("Entering get_base_rate()");
		$scope.instant_base_display = undefined;
		$scope.percentage = undefined;
		
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
						} else {
							//THROW SOME EXCEPTION HERE, MODAL WITH SOMETHING OR SOMETHING
							$scope.instant_base_display = "Results for this country not available."
						}	
				});
			};
		};

	};
	
	var pad = function(n){return n<10 ? '0'+n : n};
	
	$scope.clear = function(){
		$scope.percentage = undefined;
	};
	
	$scope.get_historical = function(base, dt){
	  $scope.percentage_error = undefined;

	  $log.debug("Entering Get Historical");
	  $log.debug(base);
	  $log.debug(dt);
	  
	  base = $filter('uppercase')(base);
	  $log.debug(base);
		
	  // get the rates based on the histocial date from user input
		if (base !== undefined && dt !== undefined){
			
			var included = $filter('filter')($scope.countries, {$:base});
			
			if (included !== undefined){
				
				dt = $filter('date')(dt, 'yyyy-MM-dd');
			
				$log.debug(dt);
			
				RestController.get_previous_rates(dt, base)
					.then(function(response){
						$scope.previous_rate = response.data;
						var parse_country = $scope.previous_rate.rates[base];
						
						
						parse_country = $scope.previous_rate.rates[base];
						$log.debug(parse_country);
							
							if (parse_country !== undefined){
								
								$scope.percentage = ((parse_country - $scope.instant_base_display) / parse_country) * 100;
								
							} else {
								$scope.percentage_error = "Results for this date/country combination not available."
							}
	
				});
				
			} else {
				$scope.percentage = base + " is was not found in our database.";
				
			}; 
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
    $scope.dt.setDate($scope.dt.getDate() - 2)
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
  next_day.setDate(next_day.getDate() - 2);
  
  $scope.dateOptions = {
    //dateDisabled: disabled,
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

