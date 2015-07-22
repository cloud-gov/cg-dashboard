app.controller('HomeCtrl', function($scope, $http) {
    'use strict';
    $scope.title = "Cf-Console";
    $http.get('/ping') // Just attempt to use the test route in the Go backend server.
        .success(function(response) {
            $scope.backendStatus = response;
        }).error(function(response) {
            $scope.backendStatus = "offline";
        });
    // TODO. Check if logged in. If so, redirect to the "dashboard".
    // Otherwise, reload the login page.
});


app.controller('DashboardCtrl', function($scope, $http) {
    'use strict';
    $http.get('/v2/organizations').success(function(response) {
        $scope.orgs = response.resources;
    });
    $scope.showOrg = function(org) {
        $scope.activeOrg = org;
        $scope.orgVisible = true;
        $http.get(org.entity.spaces_url).success(function(response) {
            var resources = response.resources;
            if (resources.length > 0) {
                $scope.activeSpaces = response.resources;
                $scope.noSpaces = false;
            } else {
                $scope.noSpaces = true;
                $scope.activeSpaces = false;
            }
        });
    };
    $scope.clearDashboard = function() {
        $scope.orgVisible = false;
        $scope.activeOrg = false;
    };
});

app.controller('SpaceController', function($scope, $http) {
    'use strict';
    // Get the apps for spaces
    $http.get($scope.space.entity.apps_url).success(function(response) {
        var resources = response.resources;
        if (resources.length > 0) {
            $scope.apps = response.resources;
        } else {
            $scope.noApps = true;
        }
    });
});
