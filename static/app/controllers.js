(function() {
    'use strict';
    // Get the app
    var app = angular.module('cfdeck');

    // Function for loadng the active org at each page
    // findActiveOrg will attempt to get the active org from cache before
    // downloading new data.
    function loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa) {
        $cloudfoundry.isAuthorized()
            .then(function(status) {
                if (status) {
                    var renderOrg = function(orgData) {
                        // Displace org data
                        if (orgData['code'] == 30003) {
                            MenuData.data.currentOrg = "404";
                        } else {
                            MenuData.data.currentOrg = orgData;
                            $scope.activeOrg = orgData;
                            $scope.spaces = $scope.activeOrg.spaces;
                        };
                        // Load org memory usage and quota usage if it isn't loaded
                        if (!orgData.quota) {
                            $cloudfoundry.getQuotaUsage(orgData);
                        };
                        // Find user permissions for orgs
                        $uaa.findUserPermissions($routeParams['orgguid'], 'managed_organizations')
                            .then(function(managerStatus) {
                                MenuData.data.orgManager = managerStatus;
                            });
                    };
                    var renderSpace = function(spaceData) {
                        MenuData.data.currentSpace = spaceData;
                        $scope.space = spaceData;
                    };
                    $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderOrg);
                    // Render a space if there is a spaceguid
                    if ($routeParams.spaceguid) {
                        $cloudfoundry.findActiveSpace($routeParams['spaceguid'], renderSpace);
                        // Find user permissions for a space
                        $uaa.findUserPermissions($routeParams['spaceguid'], 'managed_spaces')
                            .then(function(managerStatus) {
                                $scope.spaceManager = managerStatus;
                            });
                    };

                } else {
                    $cloudfoundry.returnHome()
                }

            });
    };

    app.controller('MainCtrl', function($scope, $cloudfoundry, MenuData) {
        // Initalize menudata
        $scope.MenuData = MenuData;
        // Clean menu data to return home
        $scope.clearDashboard = function() {
            $scope.MenuData.data = {};
        };
    });

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $routeParams, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
    });

    app.controller('OrgManagementCtrl', function($scope, $cloudfoundry, $uaa, $routeParams, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        $scope.addUserToOrg = function(user) {
            user.id = undefined;
            return $uaa.getUserGuidFromUserName(user)
                .then(function(user) {
                    $cloudfoundry.setOrgUserCategory($routeParams['orgguid'], user.id, 'users', true)
                        .then(function() {
                            $scope.showTab('current_org_users');
                        });
                }).catch(function(error) {
                    console.log('Unable to add the user');
                });
        };
        $scope.removeUserFromOrg = function(userGuid) {
            // TODO: remove all roles before removing from org so that if the user is re-added, the user will have no roles.
            return $cloudfoundry.setOrgUserCategory($routeParams['orgguid'], userGuid, 'users', false)
                .then(function() {
                    $scope.showTab('current_org_users')
                })
        };
        // Show a specific tab
        $scope.showTab = function(tab) {
            $scope.activeTab = tab;
            if (tab == 'current_org_users') {
                $scope.org_users = [];
                $cloudfoundry.getOrgUsers($routeParams['orgguid'], $scope.org_users, $scope.loadComplete);
            }
        };
        // Make the current org users tab the default active tab
        $scope.activeTab = 'current_org_users';
        // Get all the users associated with an org
        $scope.org_users = [];
        $scope.loadComplete = {
            status: false
        };
        $cloudfoundry.getOrgUsers($routeParams['orgguid'], $scope.org_users, $scope.loadComplete);
    });

    app.controller('OrgUserManagementCtrl', function($scope, $cloudfoundry, $routeParams, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        $scope.initOrgManagerState = false;
        var renderOrgUserOrgManagerState = function(response) {
            $scope.org_manager = response;
            $scope.orgManagerStatus = (response[0]) && (response[0].metadata.guid == $routeParams['userguid']);
            // No need to set up watching again if we have already.
            if ($scope.initOrgManagerState == true) {
                return;
            }
            $scope.$watch('orgManagerStatus', function(newValue, oldValue) {
                // Only update when there is an actual change in value. This prevents unnecessary calls from
                // anomalies where the watch call is triggered. Also, go ahead and trigger if the old value
                // is undefined. That means we are initializing for the first time.
                if ((oldValue != newValue || (oldValue == undefined)) && (newValue != undefined)) {
                    $scope.orgManagerStateChanging = true;
                    return $cloudfoundry.setOrgUserCategory($routeParams['orgguid'], $routeParams['userguid'], 'managers', newValue)
                        .then(function() {
                            // Re-enable toggle switch;
                            $scope.orgManagerStateChanging = false;
                        });
                }
            });
            // This also enables the button after initial loading.
            $scope.initOrgManagerState = true;
        };

        $scope.initBillingManagerState = false;
        var renderOrgUserBillingManagerState = function(response) {
            $scope.billing_manager = response;
            $scope.billingManagerStatus = (response[0]) && (response[0].metadata.guid == $routeParams['userguid']);
            // No need to set up watching again if we have already.
            if ($scope.initBillingManagerState == true) {
                return;
            }
            $scope.$watch('billingManagerStatus', function(newValue, oldValue) {
                // Only update when there is an actual change in value. This prevents unnecessary calls from
                // anomalies where the watch call is triggered. Also, go ahead and trigger if the old value
                // is undefined. That means we are initializing for the first time.
                if ((oldValue != newValue || (oldValue == undefined)) && (newValue != undefined)) {
                    $scope.billingManagerStateChanging = true;
                    return $cloudfoundry.setOrgUserCategory($routeParams['orgguid'], $routeParams['userguid'], 'billing_managers', newValue)
                        .then(function() {
                            // Re-enable toggle switch;
                            $scope.billingManagerStateChanging = false;
                        });
                }
            });
            // This also enables the button after initial loading.
            $scope.initBillingManagerState = true;
        };


        $scope.initOrgAuditorState = false;
        var renderOrgUserOrgAuditorState = function(response) {
            $scope.org_auditor = response;
            $scope.orgAuditorStatus = (response[0]) && (response[0].metadata.guid == $routeParams['userguid']);

            // No need to set up watching again if we have already.
            if ($scope.initOrgAuditorState == true) {
                return;
            }
            $scope.$watch('orgAuditorStatus', function(newValue, oldValue) {
                // Only update when there is an actual change in value. This prevents unnecessary calls from
                // anomalies where the watch call is triggered. Also, go ahead and trigger if the old value
                // is undefined. That means we are initializing for the first time.
                if ((oldValue != newValue || (oldValue == undefined)) && (newValue != undefined)) {
                    $scope.orgAuditorStateChanging = true;
                    return $cloudfoundry.setOrgUserCategory($routeParams['orgguid'], $routeParams['userguid'], 'auditors', newValue)
                        .then(function() {
                            // Re-enable toggle switch;
                            $scope.orgAuditorStateChanging = false;
                        });
                }
            });
            // This also enables the button after initial loading.
            $scope.initOrgAuditorState = true;
        };
        $cloudfoundry.getOrgUserCategory($routeParams['orgguid'], $routeParams['userguid'], 'managers', 'manager_guid')
            .then(renderOrgUserOrgManagerState);
        $cloudfoundry.getOrgUserCategory($routeParams['orgguid'], $routeParams['userguid'], 'billing_managers', 'billing_manager_guid')
            .then(renderOrgUserBillingManagerState);
        $cloudfoundry.getOrgUserCategory($routeParams['orgguid'], $routeParams['userguid'], 'auditors', 'auditor_guid')
            .then(renderOrgUserOrgAuditorState);




    });

    app.controller('SpaceCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        $scope.activeTab = 'apps';
    });

    app.controller('SpaceServicesCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData, $uaa) {
        var renderServices = function(services) {
            $scope.services = services;
        };
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        $cloudfoundry.getSpaceServices($routeParams['spaceguid'])
            .then(renderServices);
        $scope.activeTab = "services"
    });

    app.controller('SpaceUserCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        var renderUsers = function(spaceUsers) {
            $scope.spaceUsers = spaceUsers;
            // Get all the users associated with an org
            $scope.users = [];
            $scope.loadComplete = {
                status: false
            };
            $cloudfoundry.getOrgUsers($routeParams['orgguid'], $scope.users, $scope.loadComplete);
        };
        $scope.unsetActiveUser = function() {
            $scope.activeUser = null;
            $scope.disableSwitches = null;
            $scope.spaceUserError = null;
        };
        $scope.setActiveUser = function(user) {
            $scope.disableSwitches = true;
            var activeUser = $scope.spaceUsers.filter(function(spaceuser) {
                return spaceuser.metadata.guid === user.metadata.guid
            });
            if (activeUser.length === 1) {
                activeUser = activeUser[0]
                $scope.activeUser = activeUser;
                $scope.activeUser.managers = activeUser.entity.space_roles.indexOf('space_manager') >= 0;
                $scope.activeUser.auditors = activeUser.entity.space_roles.indexOf('space_auditor') >= 0;
                $scope.activeUser.developers = activeUser.entity.space_roles.indexOf('space_developer') >= 0;
            } else {
                $scope.activeUser = user;
                $scope.activeUser.managers = false;
                $scope.activeUser.auditors = false;
                $scope.activeUser.developers = false;
            }
            $scope.disableSwitches = false;
        };
        $scope.toggleSpaceUserPermissions = function(permission) {
            $scope.disableSwitches = true;
            $scope.spaceUserError = null;
            $cloudfoundry.toggleSpaceUserPermissions($scope.activeUser, permission, $routeParams['spaceguid'])
                .then(function(response) {
                    if (response.status !== 201) {
                        $scope.activeUser[permission] = !$scope.activeUser[permission];
                        $scope.spaceUserError = response.data.description;
                    } else {
                        $cloudfoundry.getSpaceUsers($routeParams['spaceguid'])
                            .then(renderUsers);
                    }
                    $scope.disableSwitches = false;
                });
        };
        $cloudfoundry.getSpaceUsers($routeParams['spaceguid'])
            .then(renderUsers);
        $scope.activeTab = "users";
    });

    app.controller('MarketCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        // Get all the services associated with an org
        $cloudfoundry.getOrgServices($routeParams['orgguid']).then(function(services) {
            $scope.services = services;
        });
    });

    app.controller('ServiceCtrl', function($scope, $cloudfoundry, $routeParams, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
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
                $scope.message = {
                    type: 'error',
                    message: response.data.description
                }
            } else {
                $scope.activePlan = null;
                $scope.message = {
                    type: 'success',
                    message: "Service Created!"
                };
            }
        };
        // Show maker and populate with space info
        $scope.showServiceMaker = function(plan) {
            $scope.message = null;
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

    app.controller('AppCtrl', function($scope, $cloudfoundry, $routeParams, $interval, MenuData, $uaa) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);

        var getServiceCredentials = function(service) {
            $cloudfoundry.getServiceCredentials(service)
                .then(function(credentials) {
                    service.credentials = credentials;
                });
        }


        //Show the available services
        var loadServices = function(boundSevices) {
            $cloudfoundry.getSpaceServices($routeParams['spaceguid']).then(function(services) {
                // Add additional info to the services if they are bound
                $scope.availableServices = services.map(function(service) {
                    boundSevices.forEach(function(boundService) {
                        if (boundService.guid == service.metadata.guid) {
                            // Add the bound service info to services
                            service.boundService = boundService;
                            getServiceCredentials(service)
                        };
                    });
                    return service;
                });
                $scope.servicesLoaded = true;
            });
        };


        // Inject Math functions into the view.
        $scope.Math = window.Math;
        var renderAppSummary = function(appSummary) {
            // Only render while we are not updating an app ourselves.
            if ($cloudfoundry.getPollAppStatusProperty() === true) {
                $scope.appSummary = appSummary;
                // Load services only when, they haven't been collected
                if (!$scope.servicesLoaded) {
                    loadServices($scope.appSummary.services);
                }
            }
        };
        var renderAppStats = function(appStats) {
            // Only render while we are not updating an app ourselves.
            if ($cloudfoundry.getPollAppStatusProperty() === true) {
                $scope.appStats = appStats;
            }
        };
        var renderAppLogs = function(appLogs) {
		$scope.appLogs = appLogs;
	}
        var renderAppEvents = function(appEvents) {
            $scope.appEvents = [];
	    // Go through the events and pull out the data we want (which is what the cf events command will give us)
	    for (var i = 0; i < appEvents.length; i++){
		var singleEvent = {};
		singleEvent.time = appEvents[i].entity.timestamp;
		singleEvent.type = appEvents[i].entity.type;
		singleEvent.actor = appEvents[i].entity.actor_name;
		singleEvent.desc = '';
		if (appEvents[i].entity.metadata.request) {
			singleEvent.desc = [];
			if (appEvents[i].entity.metadata.request.state) {
				singleEvent.desc.push('state: ' + appEvents[i].entity.metadata.request.state);
			}
			if (appEvents[i].entity.metadata.request.name) {
				singleEvent.desc.push('name: ' + appEvents[i].entity.metadata.request.name);
			}
			if (appEvents[i].entity.metadata.request.memory) {
				singleEvent.desc.push('memory: ' + appEvents[i].entity.metadata.request.memory);
			}
			if (appEvents[i].entity.metadata.request.buildpack) {
				singleEvent.desc.push('buildpack: ' + appEvents[i].entity.metadata.request.buildpack);
			}
		}
		$scope.appEvents.push(singleEvent);
	    }
        };
        var resetAppStatsPoll = function() {
            $scope.statsPromise = $interval(function() {
                $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                $cloudfoundry.getAppStats($routeParams['appguid']).then(renderAppStats);
            }, 5000);
            // Make sure to clean up afterwards when the page is naviageted away.
            $scope.$on('$destroy', function() {
                $interval.cancel($scope.statsPromise);
            });
        };
	// Get App Logs
	$scope.getAppLogs = function() {
		$cloudfoundry.getAppLogs($routeParams['appguid']).then(renderAppLogs);
	}
	// Get App Events
	$scope.getAppEvents = function() {
		$cloudfoundry.getAppEvents($routeParams['appguid']).then(renderAppEvents);
	}
        // Create new Route
        $scope.createRoute = function(newRoute) {
            $scope.routeErrorMsg = null;
            if (newRoute && newRoute.domain_guid && newRoute.host) {
                $scope.blockRoutes = true;
                newRoute.space_guid = $routeParams['spaceguid'];
                $cloudfoundry.createRoute(newRoute, $routeParams['appguid'])
                    .then(function(response) {
                        if (response.status === 400) {
                            $scope.routeErrorMsg = response.data.description;
                        } else {
                            $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                        };
                        $scope.blockRoutes = false;
                    });
            } else {
                $scope.routeErrorMsg = "Please provide both host and domain."
            };
        };
        // Delete Route
        $scope.deleteRoute = function(oldRoute) {
            $scope.blockRoutes = true;
            $cloudfoundry.deleteRoute(oldRoute)
                .then(function(response) {
                    $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                    $scope.blockRoutes = false;
                })
        };
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
            };
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
        // Bind a service
        $scope.bindService = function(service) {
            $scope.disableServiceBinder = true;
            $cloudfoundry.bindService({
                service_instance_guid: service.metadata.guid,
                app_guid: $routeParams['appguid']
            }).then(function(response) {
                $scope.servicesLoaded = false;
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
                $scope.servicesLoaded = false;
                $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
                $scope.disableServiceBinder = false;
            });
        };
        // Get summary of apps
        $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
        // TODO: Make it so it won't request stats if the state in the summary is not STARTED.
        $cloudfoundry.getAppStats($routeParams['appguid']).then(renderAppStats);
        resetAppStatsPoll();
	$scope.getAppEvents();
	$scope.getAppLogs();
    });
}());
