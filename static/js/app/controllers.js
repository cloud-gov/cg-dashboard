app.controller('HomeCtrl', function($scope, $http) {
    $scope.title = "Cf-Console";
    $http.get('/ping') // Just attempt to use the test route in the Go backend server.
        .success(function(response) {
            $scope.backendStatus = response
        }).error(function(response) {
            $scope.backendStatus = "offline"
        });
    // TODO. Check if logged in. If so, redirect to the "dashboard".
    // Otherwise, reload the login page.
});

app.controller('LoginCtrl', function($scope, $http) {
    // TODO. Check if logged in. If so, redirect to the "dashboard".
    // Otherwise, leave at login page.
});

app.controller('DashboardCtrl', function($scope, $http, $location) {
    $http.get('/v2/organizations')
        .success(function(response) {
            $scope.orgs = response.resources
        }).error(function(response, status) {
            if (status == 401) {
                // If unauthorized, redirect to login.
                $location.path("/login")
            }
            $scope.data = "Error unable to get data with OAuth guarded API. Response: " + JSON.stringify(response) + ". Code: " + status
        });
});

app.controller('QuotaController', function($scope, $http) {
    $http.get($scope.org.entity.quota_definition_url).success(function(response) {
        $scope.data = response.entity.name
    }).error(function(response) {
        $scope.data = 'NA'
    });
});

app.controller('SpacesController', function($scope, $http) {
    $http.get($scope.org.entity.spaces_url).success(function(response) {
        $scope.spaces = response.resources
    }).error(function(response) {
        console.log('No Spaces')
    });
});

app.controller('AppController', function($scope, $http) {
    $http.get($scope.space.entity.apps_url).success(function(response) {
        $scope.apps = response.resources
    }).error(function(response) {
        console.log('No Apps')
    });
});
