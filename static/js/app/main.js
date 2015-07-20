var app = angular.module('cfconsole', ['ngRoute']);
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'js/app/partials/index.html',
			controller: 'HomeCtrl'
		})
		.when('/login', {
			templateUrl: 'js/app/partials/login.html',
			controller: 'LoginCtrl'
		})
		.when('/dashboard', {
			templateUrl: 'js/app/partials/dashboard.html',
			controller: 'DashboardCtrl'
		})
		.otherwise({ redirectTo: "/ohno"}); // Sanity check to make sure the right controller is hit. 
});
