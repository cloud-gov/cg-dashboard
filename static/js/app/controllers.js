(function() {
    'use strict';

    var app = angular.module('cfconsole');
    app.controller('HomeCtrl', function($scope, $location, $cloudfoundry) {
        //Render the auth status of the backend
        var renderStatus = function(status) {
            $scope.backendStatus = status;
        };
        $cloudfoundry.getAuthStatus()
            .then(renderStatus);
    });

    app.controller('DashboardCtrl', function($scope, $location, $cloudfoundry) {
        // Render the orgs on the page
        var renderOrgs = function(orgs) {
            $scope.orgs = orgs;
        };
        // Render a specific org to the page
        var renderOrgDetails = function(data) {
            $scope.orgDropDownName = data.org_name;
            var spaces = data.resources;
            if (spaces.length > 0) {
                $scope.activeSpaces = spaces;
            } else {
                $scope.activeSpaces = null;
            }
        };
        // Get data for a specific org
        $scope.showOrg = function(org) {
            $scope.activeOrg = org;
            $scope.visibleTab = "organizations";
            $scope.activeApps = null;
            $cloudfoundry.getOrgSpaceDetails(org)
                .then(renderOrgDetails, function() {
                    $location.path("/")
                });
        };
        // Clear the dashboard
        $scope.clearDashboard = function() {
            $scope.visibleTab = null;
            $scope.activeOrg = null;
            $scope.orgDropDownName = null;
        };
        // Get Orgs or return to login page
        $cloudfoundry.getOrgs()
            .then(renderOrgs, function() {
                $location.path('/');
            });
        // Catch the active space from SpaceController
        $scope.$on('emitActiveSpace', function(event, apps) {
            $scope.activeApps = apps;
        });
    });

    app.controller('SpaceController', function($scope, $cloudfoundry, $location) {
        // Set the current active spaces 
        $scope.setActiveSpace = function() {
                $scope.$emit('emitActiveSpace', $scope.apps);
                var pills = document.querySelector('#space-pills').children;
                for (var i = 0, len = pills.length; i < len; i++) {
                    pills[i].classList.remove("active");
                };
                $scope.activePill = document.querySelector('#space-' + $scope.space.entity.name);
                if ($scope.activePill) {
                    $scope.activePill.parentElement.classList.add("active");
                };
            }
            // Render apps
        var renderApps = function(apps) {
            $scope.apps = apps;
        };
        // Get individual app deatils
        $cloudfoundry.getSpaceDetails($scope.space).then(renderApps, function() {
            $location.path('/')
        });
    });
}());
