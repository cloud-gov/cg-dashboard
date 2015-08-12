(function() {
    // CloudFoundry Service
    angular.module('cfdeck').service('$cloudfoundry', function($http, $location, $log) {

        // Declare variables for passing data via this service
        var orgs, activeOrg;

        // Redirects back to home page
        var returnHome = function(response) {
            $location.path('/');
            return {
                'status': 'unauthorized'
            };
        }

        // Returns the authentication status from promise
        var returnAuthStatus = function(response) {
            return response.data.status
        };

        // Get current authentication status from server
        this.getAuthStatus = function() {
            return $http.get('/v2/authstatus')
                .then(returnAuthStatus, returnAuthStatus);
        };

	this.isAuthorized = function() {
            return this.getAuthStatus()
		    .then(function(status) {
			    if (status == "authorized") {
				    return true;
			    }
			    return false;
		    });
	};

        // Get organizations
        this.getOrgs = function() {
            return $http.get('/v2/organizations')
                .then(function(response) {
                    return response.data.resources;
                }, returnHome);
        };

        // Get org details
        this.getOrgDetails = function(orgGuid) {
            return $http.get('/v2/organizations/' + orgGuid + '/summary')
                .then(function(response) {
                    return response.data;
                });
        };

        // Get space details
        this.getSpaceDetails = function(spaceGuid) {
            return $http.get('/v2/spaces/' + spaceGuid + '/summary')
                .then(function(response) {
                    return response.data;
                });
        }

        // Get services
        this.getOrgServices = function(guid) {
            return $http.get('/v2/organizations/' + guid + '/services')
                .then(function(response) {
                    return response.data.resources;
                });
        };

        // Get service plans for a service
        this.getServicePlans = function(servicePlanUrl) {
            return $http.get(servicePlanUrl)
                .then(function(response) {
                    return response.data.resources.map(function(plan) {
                        if (plan.entity.extra) {
                            plan.entity.extra = JSON.parse(plan.entity.extra);
                        }
                        return plan
                    });
                });
        };

        // Get service details for a service
        this.getServiceDetails = function(serviceGuid) {
            return $http.get('/v2/services/' + serviceGuid)
                .then(function(response) {
                    return response.data;
                });
        };

        // Functions for getting passed data
        this.setOrgsData = function(newOrgs) {
            orgs = newOrgs
        };

        // Get specific org data
        this.getOrgsData = function(callback) {
            if (!orgs) {
                $log.info('Downloaded New Org Data');
                return this.getOrgs().then(callback);
            }
            $log.info('Used cached data');
            return callback(orgs);
        };

        // Create a service instance
        this.createServiceInstance = function(requestBody) {
            return $http.post("/v2/service_instances?accepts_incomplete=true", requestBody)
                .then(function(response) {
                    return response;
                }, function(response) {
                    return response;
                });
        };

        // Delete a service instance
        this.deleteServiceInstance = function(service) {
            return $http.delete(service.metadata.url)
                .then(function(response) {
                    return response.data;
                }, function(response) {
                    return response.data;
                }); 
        };

        // Given an org guid attempts to find the active org data stored in the service
        this.findActiveOrg = function(orgGuid, callback) {
            // If the requested org is the same one stored, return it
            if (activeOrg && orgGuid === activeOrg.guid) {
                if (orgGuid === activeOrg.guid) {
                    $log.info('return the cached active org');
                    return callback(activeOrg);
                }
            }
            // If the orgs data hasn't been downloaded yet, get the active org from the api
            else {
                $log.info('get org data from api');
                return this.getOrgDetails(orgGuid).then(function(org) {
                    activeOrg = org;
                    callback(org);
                });
            }
        };

        // Get app summary
        this.getAppSummary = function(appGuid) {
            return $http.get('/v2/apps/' + appGuid + '/summary')
                .then(function(response) {
                    return response.data;
                });
        };

        // Get detailed app stats
        this.getAppStats = function(appGuid) {
            return $http.get('/v2/apps/' + appGuid + '/stats')
                .then(function(response) {
                    return response.data;
                });
        };

        // Get all the services available to a space
        this.getSpaceServices = function(spaceGuid) {
            return $http.get('/v2/spaces/' + spaceGuid + '/service_instances')
                .then(function(response) {
                    return response.data.resources;
                });
        };

        // Bind a service instance to an app
        this.bindService = function(body) {
            return $http.post('/v2/service_bindings', body)
                .then(function(response) {
                    return response;
                }, function(response) {
                    return response;
                });
        };

        // Unbind a service instance from an app
        this.unbindService = function(data, callback) {
            // Look for service binding guid
            $http.get('/v2/apps/' + data.app_guid + '/service_bindings')
                .then(function(response) {
                    // Find the service binding that is attached to the current space
                    response.data.resources.forEach(function(boundService) {
                        if (boundService.entity.service_instance_guid === data.service_instance_guid) {
                            // Unbind the service and send back a message
                            return $http.delete(boundService.metadata.url)
                                .then(function(response) {
                                    callback(response);
                                });
                        };
                    });
                });
        };

        // Tells whether the web app should poll for newer app statuses.
        // Useful for when we are in the middle of updating the app status ourselves and we don't
        // want a poll to interrupt the UI.
        var pollAppStatus = true;
        // Getter function for pollAppStatus.
        this.getPollAppStatusProperty = function() {
            return pollAppStatus;
        };
        // Setter function for pollAppStatus.
        var setPollAppStatusProperty = function(value) {
            pollAppStatus = value;
        };
        // Internal generic function that actually submits the request to backend to change the app.
        this.changeAppState = function(app, desired_state) {
            setPollAppStatusProperty(false); // prevent UI from refreshing.
            return $http.put("/v2/apps/" + app.guid + "?async=false&inline-relations-depth=1", {
                    "state": desired_state
                })
                .then(function(response) {
                    // Success
                    // Set the state immediately to stop so that UI will force a load of the new options.
                    // UI will change the buttons based on the state.
                    app.state = desired_state;
                }, function(response) {
                    // Failure
                }).finally(function() {
                    setPollAppStatusProperty(true); // allow UI to refresh via polling again.
                });
        };
        // Wrapper function that will submit a request to start an app.
        this.startApp = function(app) {
            return this.changeAppState(app, "STARTED");
        };
        // Wrapper function that will submit a request to stop an app.
        this.stopApp = function(app) {
            return this.changeAppState(app, "STOPPED");
        };
        // Wrapper function that will submit a request to restart an app.
        this.restartApp = function(app) {
            // _this = this allows us to access another service method again within a promise.
            _this = this;
            return this.changeAppState(app, "STOPPED")
                .then(function() {
                    return _this.changeAppState(app, "STARTED");
                });
        };

    });

}());
