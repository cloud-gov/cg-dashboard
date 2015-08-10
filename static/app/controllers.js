(function() {
    'use strict';
    // Get the app
    var app = angular.module('cfdeck');

    // Function for loadng the active org at each page
    // findActiveOrg will attempt to get the active org from cache before
    // downloading new data.
    function loadOrg(MenuData, $routeParams, $cloudfoundry, $scope) {
        var renderOrg = function(orgData) {
            if (orgData['code'] == 30003) {
                MenuData.data.currentOrg = "404";
            } else {
                MenuData.data.currentOrg = orgData;
                $scope.activeOrg = orgData;
                $scope.spaces = $scope.activeOrg.spaces;
            }
        };
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderOrg);
    };

    app.controller('HomeCtrl', function($scope, $cloudfoundry, MenuData) {
        //Render the auth status of the backend
        var renderStatus = function(status) {
            $scope.backendStatus = status;
        };
        //Get the auth status of the backend
        $cloudfoundry.getAuthStatus()
            .then(renderStatus);
    });

    app.controller('MainCtrl', function($scope, $cloudfoundry, $location, MenuData) {
        // Render the orgs on the page
        var renderOrgs = function(orgs) {
            $scope.orgs = orgs;
            $cloudfoundry.setOrgsData(orgs);
        };
        // Clean menu data to return home
        $scope.clearDashboard = function() {
            $scope.MenuData.data = {}
        };
        // Load the org data
        $cloudfoundry.getOrgsData(renderOrgs);
        $scope.MenuData = MenuData;
    });

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
    });

    app.controller('SpaceCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
        var renderSpace = function(space) {
            $scope.space = space;
        };
        // Get the orgs data from cache or load new data
        $cloudfoundry.getSpaceDetails($routeParams['spaceguid'])
            .then(renderSpace);
    });

    app.controller('MarketCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
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
    });

    app.controller('ServiceCtrl', function($scope, $cloudfoundry, $routeParams, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);
        // Send service plans to the view
        var renderServicePlans = function(servicePlans) {
            $scope.plans = servicePlans;
        };
        // Render service details and request service plans
        var renderService = function(service) {
            $scope.service = service;
            $cloudfoundry.getServicePlans(service.entity.service_plans_url).then(renderServicePlans);
        };
        // Checks if the service was created and display message
        var checkIfCreated = function(response) {
            $scope.disableSubmit = false;
            if (response.status == 400) {
                $scope.message = response.data.description;
            } else {
                $scope.message = "Service Created!";
            }
        };
        // Show maker and populate with space info
        $scope.showServiceMaker = function(plan) {
            $scope.activePlan = plan;
        };
        // Send request to create service instance
        $scope.createServiceInstance = function(serviceInstance) {
            $scope.disableSubmit = true
            serviceInstance.service_plan_guid = $scope.activePlan.metadata.guid;
            $cloudfoundry.createServiceInstance(serviceInstance).then(checkIfCreated);
        };
        // Get service details
        $cloudfoundry.getServiceDetails($routeParams['serviceguid']).then(renderService);
    });

    app.controller('AppCtrl', function($scope, $cloudfoundry, $routeParams, $interval, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);

        // Inject Math functions into the view.
        $scope.Math = window.Math;
        var renderAppSummary = function(appSummary) {
            // Only render while we are not updating an app ourselves.
            if ($cloudfoundry.getPollAppStatusProperty() === true) {
                $scope.appSummary = appSummary;
            }
        }
        var renderAppStats = function(appStats) {
            // Only render while we are not updating an app ourselves.
            if ($cloudfoundry.getPollAppStatusProperty() === true) {
                $scope.appStats = appStats;
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
	$scope.startApp = function(app) {
		// Grey out the UI buttons while waiting.
		$scope.starting = true;
		$cloudfoundry.startApp(app)
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

        // Bind a service
        $scope.bindService = function(service) {
            $scope.disableServiceBinder = true;
            $cloudfoundry.bindService({
                service_instance_guid: service.metadata.guid,
                app_guid: $routeParams['appguid']
            }).then(function(response) {

                $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                $scope.disableServiceBinder = false;
            });
        };
        // Unbind a service
        $scope.unbindService = function(service) {
            $scope.disableServiceBinder = true;
            $cloudfoundry.unbindService({
                service_instance_guid: service.boundService.guid,
                app_guid: $routeParams['appguid']
            }, function(response) {
                $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                $scope.disableServiceBinder = false;
            });
        };
        // Get summary of apps
        $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
        // TODO: Make it so it won't request stats if the state in the summary is not STARTED.
        $cloudfoundry.getAppStats($routeParams['appguid']).then(renderAppStats);
        resetAppStatsPoll();
    });


}());
