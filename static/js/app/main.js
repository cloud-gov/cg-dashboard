var app = angular.module('cfconsole', ['ngRoute']);
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'js/app/partials/index.html',
			controller: 'HomeCtrl'
		})
		.otherwise({ redirectTo: "/ohno"}); // Sanity check to make sure the right controller is hit. 
});
