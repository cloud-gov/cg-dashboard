(function() {
    'use strict';

    var app = angular.module('cfdeck');
    app.controller('HomeCtrl', function($scope, $cloudfoundry) {
        //Render the auth status of the backend
        var renderStatus = function(status) {
            $scope.backendStatus = status;
        };
        $cloudfoundry.getAuthStatus()
            .then(renderStatus);
    });

    app.controller('DashboardCtrl', function($scope, $cloudfoundry) {
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
                .then(renderOrgDetails);
        };
        // Clear the dashboard
        $scope.clearDashboard = function() {
            $scope.visibleTab = null;
            $scope.activeOrg = null;
            $scope.orgDropDownName = null;
        };
        // Get Orgs or return to login page
        $cloudfoundry.getOrgs()
            .then(renderOrgs);
        // Catch the active space from SpaceController
        $scope.$on('emitActiveSpace', function(event, apps) {
            $scope.activeApps = apps;
        });
    });

    app.controller('SpaceController', function($scope, $cloudfoundry, $interval) {
        // Set the current active spaces 
        $scope.setActiveSpace = function() {
		// Create a recurring interval to emit to the screen for updates.
		var emitActiveSpaceApps = function() {
			$scope.$emit('emitActiveSpace', $scope.apps);
			$scope.activeSpaces.forEach(function(space) {
			    if($scope.space.metadata.guid == space.metadata.guid)
				space.selected = true;
			    else
				space.selected = false;
			});
		};
		emitActiveSpaceApps();
		$interval(emitActiveSpaceApps,5000);
            }
	// Render apps
        var renderApps = function(apps) {
            $scope.apps = apps;
        };
        // Get individual app deatils
        $cloudfoundry.getSpaceDetails($scope.space)
            .then(renderApps);
	// Create a recurring interval to download updates.
	$interval(function() {
		$cloudfoundry.getSpaceDetails($scope.space)
			.then(renderApps);
	}, 5000);
    });
}());
