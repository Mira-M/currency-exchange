'use strict';

angular.module('myApp.HistoricalController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'HistoricalController/historical.html',
    controller: 'HistoricalCtrl'
  });
}])

.controller('HistoricalCtrl', [function() {

}]);