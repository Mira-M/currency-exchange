'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.ConversionController',
  'myApp.HistoricalController',
  'myApp.version',
  'ui.bootstrap'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/conversion'});
}])

.directive("defooter", function() {
	return {
		restrict : 'A',
		templateUrl : 'footer.html',
		scope : true,
		transclude : false
	};
})

.service('ViewController', [function(){
	this.countries =
	   [{img : '/components/img/AUD_Australia.jpg', full_name : 'Australia', code: 'AUD'},
		{img : '/components/img/BGN_Bulgaria.jpg', full_name : 'Bulgaria', code: 'BGN'},
		{img : '/components/img/BRL_Brazil.jpg', full_name : 'Brazil', code: 'BRL'},
		{img : '/components/img/CAD_Canada.jpg', full_name : 'Canada', code: 'CAD'},
		{img : '/components/img/CHF_Swiss.jpg', full_name : 'Switzerland', code: 'CHF'},
		{img : '/components/img/CHY_China.jpg', full_name : 'China', code: 'CNY'},
		{img : '/components/img/CZK_CzechRepub.jpg', full_name : 'Czech Republic', code: 'CZK'},
		{img : '/components/img/DKK_Denmark.jpg', full_name : 'Denmark', code: 'DKK'},
		{img : '/components/img/EUR_Europe.jpg', full_name : 'Europe', code: 'EUR'},
		{img : '/components/img/GBP_GreatBritian.jpg', full_name : 'Great Britain', code: 'GBP'},
		{img : '/components/img/HRK_Croatia.jpg', full_name : 'Croatia', code: 'HRK'},
		{img : '/components/img/HUF_Hungary.jpg', full_name : 'Hungary', code: 'HUF'},
		{img : '/components/img/IDR_Indonesia.jpg', full_name : 'Indonesia', code: 'IDR'},
		{img : '/components/img/ILS_Isreal.jpg', full_name : 'Isreal', code: 'ILS'},
		{img : '/components/img/INR_India.jpg', full_name : 'India', code: 'INR'},
		{img : '/components/img/JPY_Japan.jpg', full_name : 'Japan', code: 'JPY'},
		{img : '/components/img/KRW_SouthKorean.jpg', full_name : 'South Korea', code: 'KRW'},
		{img : '/components/img/MXN_Mexican.jpg', full_name : 'Mexican', code: 'MXN'},
		{img : '/components/img/NOK_Norwegian.jpg', full_name : 'Norway', code: 'NOK'},
		{img : '/components/img/NZD_NewZealand.jpg', full_name : 'New Zealand', code: 'NZD'},
		{img : '/components/img/PHP_Philippine.jpg', full_name : 'Philippines', code: 'PHP'},
		{img : '/components/img/PLN_Poland.jpg', full_name : 'Poland', code: 'PLN'},
		{img : '/components/img/RON_Romania.jpg', full_name : 'Romania', code: 'RON'},
		{img : '/components/img/RUB_Russia.jpg', full_name : 'Russia', code: 'RUB'},
		{img : '/components/img/SGD_Singapore.jpg', full_name : 'Singapore', code: 'SGD'},
		{img : '/components/img/USD_UnitedStates.jpg', full_name : 'United States', code: 'USD'}	
	];
	
	
	this.access_key = '6e951159cccd026980477d132c39eb3a';
	
	this.footer_text = '© Copyright 2016 Direct Exchange';
	
}])

.service('RestController', ['$http', function($http){
	
	this.get_latest_rates = function(base_country){
		return $http.get('http://api.fixer.io/latest?base=' + base_country)
	};
	
	this.get_previous_rates = function(previous_date, base_country){
		
		// This snippet will handle the fact that the API is free and uses EUR by default for all base historical calls
			if (base_country !== 'EUR'){
				var base = 'EUR'
			} else {
				var base = 'USD';
			};
			
		return $http.get('http://api.fixer.io/' + previous_date + '?base=' + base)
	};
	
	this.get_current_rate = function(country){
		
		if (country !== 'EUR'){
				return $http.get('http://api.fixer.io/latest?symbols=' + country)
			} else {
				return $http.get('http://api.fixer.io/latest?base=USD')
			};
	}
	
}]);


