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

app.controller('OrgController', function($scope, $http) {
    $scope.get_orgs = function () {
        $http.get('/v2/organizations').success(function(response) {
            console.log(response)
            $scope.data = response.resources
        }).error(function(response) {
            $scope.data = 'NA'
        });
    }
});



app.controller('DashboardCtrl', function($scope, $http, $location) {

    load_data = function(endpoint, scope_name) {
       $http.get(endpoint).success(function(response) {
            $scope[scope_name] = response.resources
        });
    }

    load_data('/v2/organizations', 'orgs');
    load_data('/v2/quota_definitions', 'quotas');
    load_data('/v2/spaces', 'spaces');
    //load_data('/v2/apps', 'apps');

    $scope.getOrgs = function() {
        load_data('/v2/organizations', 'orgs');
        $scope.show = {'orgs': true};
    };
    $scope.getQuotas = function() {
        load_data('/v2/quota_definitions', 'quotas');
        $scope.show = {'quotas': true};
    };
    $scope.getSpaces = function() {
        load_data('/v2/spaces', 'spaces');
        $scope.show = {'spaces': true};
    };
    $scope.getApps = function() {
        load_data('/v2/apps', 'apps');
        $scope.show = {'apps': true};
    };
});


app.controller('OrgController', function($scope, $http) {
    quota = $scope.quotas.filter(function (element){
        return element.metadata.guid == $scope.org.entity.quota_definition_guid;
    });
    $scope.quota = quota[0];
});


app.controller('SpaceController', function($scope, $http) {
    org = $scope.orgs.filter(function (element){
        return element.metadata.guid == $scope.space.entity.organization_guid;
    });
    $scope.org = org[0];
});

app.controller('AppController', function($scope, $http) {

    space = $scope.spaces.filter(function (element){
        return element.metadata.guid == $scope.app.entity.space_guid;
    });
    $scope.space = space[0];


    org = $scope.orgs.filter(function (element){
        return element.metadata.guid == space[0].entity.organization_guid;
    });
    $scope.org = org[0];

});
