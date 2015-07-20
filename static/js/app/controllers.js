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
app.controller('LoginCtrl', function($scope, $http) {
	// TODO. Check if logged in. If so, redirect to the "dashboard".
	// Otherwise, leave at login page.
});
app.controller('DashboardCtrl', function($scope, $http) {
	$scope.title = "Dashboard";
	$http.get('/api/all') // Just attempt to use the test a OAuth guarded route in the Go backend server.
	.success(function(response){
		$scope.data = response
	}).error(function(response){
		$scope.data = "Error unable to get data with OAuth guarded API"
	});
});
