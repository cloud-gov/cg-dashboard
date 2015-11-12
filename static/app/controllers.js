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
        // Clean menu data to return home
        $scope.clearDashboard = function() {
            $scope.MenuData.data = {};
        };
    });

    app.controller('DashboardCtrl', function($scope, $cloudfoundry, MenuData) {
        // Prevent user from going to dashboard if they are not logged in.
        $cloudfoundry.isAuthorized()
            .then(function(status) {
                if (!status) {
                    $cloudfoundry.returnHome();
                }
                else {
                <!-- HappyFox Live Chat Script -->
                  window.HFCHAT_CONFIG = {
                    EMBED_TOKEN: "995a2db0-46bf-11e5-986c-5b521052aa24",
                    ACCESS_TOKEN: "a5ba09020f0d40ae9eb91e299800cd47",
                    HOST_URL: "https://www.happyfoxchat.com",
                    ASSETS_URL: "https://d1l7z5ofrj6ab8.cloudfront.net/visitor"
                };


                (function() {
                    var scriptTag = document.createElement('script');
                    scriptTag.type = 'text/javascript';
                    scriptTag.async = true;
                    scriptTag.src = window.HFCHAT_CONFIG.ASSETS_URL + '/js/widget-loader.js';

                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(scriptTag, s);
                })();
                <!--End of HappyFox Live Chat Script-->


                }
            });
    });

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $routeParams, MenuData, $uaa) {
        $scope.orgActiveTab = 'spaces';
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
    });

    app.controller('OrgManagementCtrl', function($scope, $cloudfoundry, $uaa, $routeParams, MenuData) {
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope, $uaa);
        $scope.orgActiveTab = 'orgUsers';
        // Make the current org users tab the default active tab
        $scope.activeTab = 'current_org_users';
        // Get all the users associated with an org
        $scope.org_users = [];
        $scope.loadComplete = {
            status: false
        };

	$scope.addUserToOrg = function(user) {
            user.id = undefined;
            user.error = undefined;
            return $uaa.getUserGuidFromUserName(user)
                .then(function(user) {
                    if (!user.error) {
                        user.metadata = {guid: user.id};
                        user.users = true; // want it to become true.
                        $cloudfoundry.toggleOrgUserPermissions(user, "users", $routeParams['orgguid'])
                            .then(function() {
                                $scope.showTab('current_org_users');
                            });
                    } else {
                        $scope.inviteOrgUserError = user.error;
                    }
                }).catch(function(error) {
                    $scope.inviteOrgUserError = error;
                });
        };
        $scope.removeUserFromOrg = function(user) {
            user.users = false; // want it to be false aka removed.
            user.managers = user.entity.organization_roles.indexOf('org_manager') >= 0;
            user.auditors = user.entity.organization_roles.indexOf('org_auditor') >= 0;
            user.billing_managers = user.entity.organization_roles.indexOf('billing_manager') >= 0;
            $scope.removeOrgUserError = null;
            if (user.managers || user.auditors || user.billing_managers) {
                $scope.removeOrgUserError = "Please remove all other organization roles for the user before attempting to remove the user from the organization";
                return;
            }
            // TODO: remove all roles before removing from org so that if the user is re-added, the user will have no roles.
            return $cloudfoundry.toggleOrgUserPermissions(user, "users",$routeParams['orgguid'])
                .then(function(response) {
                    if (response.status !== 201) {
                        $scope.removeOrgUserError = response.data.description;
                    } else {
                        $scope.showTab('current_org_users')
                    }
                })
        };
        // Show a specific tab
        $scope.showTab = function(tab) {
            $scope.removeOrgUserError = null;
             $scope.inviteOrgUserError = null;
            $scope.activeTab = tab;
            if (tab == 'current_org_users') {
                $scope.org_users = [];
                $scope.unsetActiveUser();
                $cloudfoundry.getOrgUsers($routeParams['orgguid'], $scope.org_users, $scope.loadComplete);
            }
        };

        $scope.unsetActiveUser = function() {
            $scope.activeUser = null;
            $scope.disableSwitches = null;
            $scope.orgUserError = null;
        };
        $scope.setActiveUser = function(user) {
            $scope.disableSwitches = true;
            var activeUser = $scope.org_users.filter(function(orguser) {
                return orguser.metadata.guid === user.metadata.guid
            });
            if (activeUser.length === 1) {
                activeUser = activeUser[0]
                $scope.activeUser = activeUser;
                $scope.activeUser.managers = activeUser.entity.organization_roles.indexOf('org_manager') >= 0;
                $scope.activeUser.auditors = activeUser.entity.organization_roles.indexOf('org_auditor') >= 0;
                $scope.activeUser.billing_managers = activeUser.entity.organization_roles.indexOf('billing_manager') >= 0;
            } else {
                $scope.activeUser = user;
                $scope.activeUser.managers = false;
                $scope.activeUser.auditors = false;
                $scope.activeUser.billing_managers = false;
            }
            $scope.disableSwitches = false;
        };
        $scope.toggleOrgUserPermissions = function(permission) {
            $scope.disableSwitches = true;
            $scope.orgUserError = null;
            $cloudfoundry.toggleOrgUserPermissions($scope.activeUser, permission, $routeParams['orgguid'])
                .then(function(response) {
                    if (response.status !== 201) {
                        $scope.activeUser[permission] = !$scope.activeUser[permission];
                        $scope.orgUserError = response.data.description;
                    } else {
                        $cloudfoundry.getOrgUsers($routeParams['orgguid'], $scope.org_users, $scope.loadComplete);
                    }
                    $scope.disableSwitches = false;
                });
        };
        $cloudfoundry.getOrgUsers($routeParams['orgguid'], $scope.org_users, $scope.loadComplete);
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
            if (response.status >= 300) {
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


	// Flag to indicate if app is started. This will also let us know if we can load the stats.
	var appStarted = {value: false};
        // Inject Math functions into the view.
        $scope.Math = window.Math;
        var renderAppSummary = function(appSummary) {
            appStarted.value = (appSummary.state == "STARTED");
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
                $scope.appEventsLoading = false;
            }
        };
        var renderAppLogs = function(appLogs) {
            $scope.appLogs = appLogs;
            $scope.appLogsLoading = false;
        }
        var renderAppEvents = function(appEvents) {
            $scope.appEvents = [];
            // Go through the events and pull out the data we want (which is what the cf events command will give us)
            for (var i = 0; i < appEvents.length; i++) {
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
            $scope.summaryPromise = $interval(function() {
                $cloudfoundry.getAppSummary($routeParams['appguid']).then(renderAppSummary);
            }, 5000);
            $scope.statsPromise = $interval(function() {
                if (appStarted.value) {  // Only look up stats if app is started.
                    $cloudfoundry.getAppStats($routeParams['appguid'], appStarted).then(renderAppStats);
                }
            }, 5000);
            // Make sure to clean up afterwards when the page is naviageted away.
            $scope.$on('$destroy', function() {
                $interval.cancel($scope.summaryPromise);
                $interval.cancel($scope.statsPromise);
            });
        };
        // Get App Logs
        $scope.getAppLogs = function() {
                $scope.appLogsLoading = true;
                $cloudfoundry.getAppLogs($routeParams['appguid']).then(renderAppLogs);
            }
            // Get App Events
        $scope.getAppEvents = function() {
                $scope.appEventsLoading = true;
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
        resetAppStatsPoll();
        $scope.getAppEvents();
        $scope.getAppLogs();
    });
}());
