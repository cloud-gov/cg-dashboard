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

    app.controller('MainCtrl', function($scope, $cloudfoundry, $location, MenuData) {
      // Render the orgs on the page
      var renderOrgs = function(orgs) {
          $scope.orgs = orgs;
          $cloudfoundry.setOrgsData(orgs);
      };

      // Get Orgs or return to login page
      $cloudfoundry.getOrgsData(renderOrgs);


      $scope.MenuData = MenuData;
    });

    function loadOrg(MenuData, $routeParams, $cloudfoundry, $scope) {
      var renderOrg = function(orgData) {
          if (orgData['code'] == 30003) {
            MenuData.data.currentOrg = "404";
          } else {
            MenuData.data.currentOrg = orgData;
            $scope.activeOrg = MenuData.data.currentOrg;
            $scope.spaces = $scope.activeOrg.spaces;
          }
      };
      $cloudfoundry.getOrgDetails($routeParams['orgguid']).then(renderOrg);
    }

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData) {
      // Render the org information on the page
      loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
      $scope.visibleTab = "organizations";
    });

    app.controller('SpaceCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
        // Render the active org
        var renderActiveOrg = function(org) {
                $scope.activeOrg = org;
            }
            // Render a space in the view
        var renderSpace = function(space) {
            $scope.space = space;
        };
        //TODO: show an app
        $scope.showApp = function(app) {
            console.log("show app: " + app.name);
            console.log("show app: " + app.guid);
            $location.path($location.path() + '/apps/' + app.guid)
        };
        // Get the orgs data from cache or load new data
        $cloudfoundry.getSpaceDetails($routeParams['spaceguid'])
            .then(renderSpace);
        // Return the active org
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderActiveOrg);
        $scope.visibleTab = "spaces";
    });

    app.controller('MarketCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        // Render the active org
        var renderActiveOrg = function(org) {
            $scope.activeOrg = org;
        }
        // Show a specific service details by going to service landing page
        $scope.showService = function(service) {
            $location.path($location.path() + '/' + service.metadata.guid);
        };
        // Get all the services associated with an org
        $cloudfoundry.getOrgServices($routeParams['orgguid']).then(function(services) {
            $scope.services = services;
        });
        // Find the active org from an org guid
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderActiveOrg);
        // Show the `marketplace.html` view
        $scope.visibleTab = 'marketplace';
    });

    app.controller('ServiceCtrl', function($scope, $cloudfoundry, $routeParams) {
        // Render the active org
        var renderActiveOrg = function(org) {
            $scope.activeOrg = org;
        }
        // Send service plans to the view
        var renderServicePlans = function(servicePlans) {
            $scope.plans = servicePlans;
        };
        // Render service details and request service plans
        var renderService = function(service) {
            $scope.service = service;
            // Show the `service.html` view
            $scope.visibleTab = 'service';
            $cloudfoundry.getServicePlans(service.entity.service_plans_url).then(renderServicePlans);
        };
        // Get service details
        $cloudfoundry.getServiceDetails($routeParams['serviceguid']).then(renderService);
        // Find the active org from an org guid
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderActiveOrg);
    });
    app.controller('AppCtrl', function($scope, $cloudfoundry, $routeParams, $interval, MenuData) {
      loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
        console.log("hello");

        var renderAppSummary = function(appSummary) {
            // Only render while we are not updating an app ourselves.
            if ($cloudfoundry.getPollAppStatusProperty() === true) {
                $scope.appSummary = appSummary;
	        console.log(appSummary);
            }
        }
        var renderAppStats = function(appStats) {
            // Only render while we are not updating an app ourselves.
            if ($cloudfoundry.getPollAppStatusProperty() === true) {
                $scope.appStats = appStats;
	        console.log(appStats);
            }
        }
	var resetAppStatsPoll = function() {
            $scope.statsPromise = $interval(function() {
                $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                $cloudfoundry.getAppStats($routeParams['appguid']).then(renderAppStats);
            }, 5000);
            // Make sure to clean up afterwards when the page is naviageted away.
            $scope.$on('$destroy', function () { $interval.cancel($scope.statsPromise); });
	}
	// Stop a specified app
	$scope.stopApp = function(app) {
		// Only stop if we are currently not restarting.
		if ($scope.restarting != true) {
			// Grey out the UI buttons while waiting.
			$scope.stopping = true;
			$cloudfoundry.stopApp(app)
				.then(function() {
					// Re-enable the UI buttons.
					$scope.stopping = false;
			});
		}
	};
	// Restart a specified app
	$scope.restartApp = function(app) {
		// Only restart if we are currently not stopping.
		if ($scope.stopping != true) {
			// Grey out the UI buttons while waiting.
			$scope.restarting = true;
			$cloudfoundry.restartApp(app)
				.then(function() {
					// Re-enable the UI buttons.
					$scope.restarting = false;
			});
		}
	};
	// Start a specified app
	$scope.startApp = function(guid) {
		// Grey out the UI buttons while waiting.
		$scope.starting = true;
		$cloudfoundry.startApp(guid)
			.then(function() {
				// Re-enable the UI buttons.
				$scope.starting = false;
			});
	};
        $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
	// TODO: Make it so it won't request stats if the state in the summary is not STARTED.
        $cloudfoundry.getAppStats($routeParams['appguid']).then(renderAppStats);
        resetAppStatsPoll();
        // Show the `service.html` view
        $scope.visibleTab = 'app';
    });

}());
