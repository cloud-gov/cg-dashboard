app.controller('HomeCtrl', function($scope, $http) {
	$scope.title = "Cf-Console";
	$http.get('/ping') // Just attempt to use the test route in the Go backend server.
	.success(function(response){
		$scope.backendStatus = response
	}).error(function(response){
		$scope.backendStatus = "offline"
	});
	// TODO. Check if logged in. If so, redirect to the "dashboard".
	// Otherwise, reload the login page.
});
