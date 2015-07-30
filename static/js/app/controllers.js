(function() {
    'use strict';

    var app = angular.module('cfconsole');
    app.controller('HomeCtrl', function($scope, $cloudfoundry) {
        //Render the auth status of the backend
        var renderStatus = function(status) {
            $scope.backendStatus = status;
        };
        $cloudfoundry.getAuthStatus()
            .then(renderStatus);
    });

    app.controller('DashboardCtrl', function($scope, $cloudfoundry, $location) {
        // Render the orgs on the page
        var renderOrgs = function(orgs) {
            $scope.orgs = orgs;
            $cloudfoundry.setOrgsData(orgs);
        };
        // Get data for a specific org
        $scope.showOrg = function(org) {
            $location.path('/dashboard/org/' + org.metadata.guid);
        };
        // Get Orgs or return to login page
        $cloudfoundry.getOrgsData(renderOrgs);
    });

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        // Render the orgs on the page
        var renderOrgs = function(orgs) {
            $scope.orgs = orgs;
            $cloudfoundry.setOrgsData(orgs);
        };
        // Get data for a specific org
        $scope.showOrg = function(org) {
            $location.path('/dashboard/org/' + org.metadata.guid);
        };
        // TODO: Display Space
        $scope.showSpace = function(space) {
            console.log("show space :" + space.name);
        };
        // Render the org information on the page
        var renderOrg = function(orgData) {
            if (orgData['code'] == 30003) {
                $scope.activeOrg = "404";

            } else {
                $scope.activeOrg = orgData.name;
                $scope.spaces = orgData.spaces;
            }
        };
        // Get Orgs or return to login page
        $cloudfoundry.getOrgsData(renderOrgs)
        $cloudfoundry.getOrgDetails($routeParams['guid']).then(renderOrg)
        $scope.visibleTab = "organizations";

    });

    app.controller('SpaceController', function($scope, $cloudfoundry) {
        // Set the current active spaces 
        $scope.setActiveSpace = function() {
                $scope.$emit('emitActiveSpace', $scope.apps);
                $scope.activeSpaces.forEach(function(space) {
                    if ($scope.space.metadata.guid == space.metadata.guid)
                        space.selected = true;
                    else
                        space.selected = false;
                });
            }
            // Render apps
        var renderApps = function(apps) {
            $scope.apps = apps;
        };
        // Get individual app deatils
        $cloudfoundry.getSpaceDetails($scope.space)
            .then(renderApps);
    });
}());
