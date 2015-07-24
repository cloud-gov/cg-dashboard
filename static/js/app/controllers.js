app.controller('HomeCtrl', function($scope, $http, $location) {
    'use strict';
    $scope.title = "Cf-Console";
    $http.get('/ping') // Just attempt to use the test route in the Go backend server.
        .success(function(response) {
          $http.get('/v2/authstatus')
            .success(function(apiResponse) {
              $scope.backendStatus = apiResponse.status;
            }).error(function(apiResponse){
              $scope.backendStatus = response.status;
            });
        }).error(function(response) {
            $scope.backendStatus = "offline";
        });
});

app.controller('DashboardCtrl', function($scope, $http, $location) {
    'use strict';
    $http.get('/v2/organizations').success(function(response) {
        $scope.orgs = response.resources;
    }).error(function(response) {
        $location.path("/");
    });
    $scope.showOrg = function(org) {
        $scope.activeOrg = org;
        $scope.visibleTab = "organizations";
        $scope.activeApps = null;
        $http.get(org.entity.spaces_url).success(function(response) {
            var resources = response.resources;
            $scope.orgDropDownName = org.entity.name
            if (resources.length > 0) {
                $scope.activeSpaces = response.resources;
            } else {
                $scope.activeSpaces = null;
            }
        });
    };
    $scope.clearDashboard = function() {
        $scope.visibleTab = null;
        $scope.activeOrg = null;
        $scope.orgDropDownName = null;
    };
    $scope.$on('emitActiveSpace', function(event, apps) {
       $scope.activeApps =  apps;
    });
});

app.controller('SpaceController', function($scope, $http) {
    'use strict';
    // Get the apps for spaces
    $http.get($scope.space.entity.apps_url).success(function(response) {
        var resources = response.resources;
        if (resources.length > 0) {
            $scope.apps = response.resources;
        } else {
            $scope.apps = "noApps";
        }
    });
    $scope.setActiveSpace = function() {
        $scope.$emit('emitActiveSpace', $scope.apps);
        var pills = document.querySelector('#space-pills').children;
        for (var i = 0, len= pills.length; i < len; i++){
            pills[i].classList.remove("active");
        };
        $scope.activePill = document.querySelector('#space-' + $scope.space.entity.name);
        if ($scope.activePill){
            $scope.activePill.parentElement.classList.add("active");
        };
    }
});
