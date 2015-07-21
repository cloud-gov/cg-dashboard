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


app.controller('DashboardCtrl', function($scope, $http, $location) {

    load_data = function(endpoint, scope_name) {
       $http.get(endpoint).success(function(response) {
            $scope[scope_name] = response.resources
        });
    }
    load_data('/v2/quota_definitions', 'quotas');
    load_data('/v2/organizations', 'orgs');

});

app.controller('OrgController', function($scope, $http) {
    // Get the quota for the org
    quota = $scope.quotas.filter(function (element){
         return element.metadata.guid == $scope.org.entity.quota_definition_guid;
     });
    if (quota.length > 0)
        $scope.quota = quota[0];

    // Get the spaces and open the div
    $scope.getSpaces = function(){
        if($scope.openOrgSpaces) {
            $scope.openOrgSpaces = false;
        }
        else{
            $http.get($scope.org.entity.spaces_url).success(function(response) {
                $scope.spaces = response.resources;
                $scope.openOrgSpaces = true;
            });
        }

    }
});

app.controller('SpaceController', function($scope, $http) {
    // Get the apps for spaces
    $scope.getApps = function(){
       $http.get($scope.space.entity.apps_url).success(function(response) {
            var resources = response.resources;
            if(resources.length > 0)
                $scope.apps = response.resources;
        });
    }
});

app.controller('AppController', function($scope, $http) {
    // For functions like reset

});
