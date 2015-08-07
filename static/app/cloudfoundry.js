(function() {
    // CloudFoundry Service
    angular.module('cfdeck').service('$cloudfoundry', function($http, $location, $log) {


        // Declare variables for passing data via this service
        var orgs;

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
        }

        // Filter through a list of orgs to find the org with a specific guid
        var filterOrg = function(storedOrgs, orgGuid) {
            return storedOrgs.filter(function(storedOrgs) {
                return storedOrgs.metadata.guid === orgGuid;
            })[0]
        }

        // Get current authentication status from server
        this.getAuthStatus = function() {
            return $http.get('/v2/authstatus')
                .then(returnAuthStatus, returnAuthStatus);
        };

        // Get organizations
        this.getOrgs = function() {
            return $http.get('/v2/organizations')
                .then(function(response) {
                    return response.data.resources;
                }, returnHome);
        };

        // Get organization spaces details
        this.getOrgSpaceDetails = function(org) {
            return $http.get(org.entity.spaces_url)
                .then(function(response) {
                    var data = response.data;
                    data.org_name = org.entity.name;
                    return data;
                }, returnHome);
        };

        // Get org details
        this.getOrgDetails = function(orgGuid) {
            return $http.get('/v2/organizations/' + orgGuid + '/summary')
                .then(function(response) {
                    return response.data;
                });
        };

        // Get the spaces for an org 
        this.getOrgSpaces = function(orgSpaceUrl) {
            return $http.get(orgSpaceUrl)
                .then(function(response) {
                    return response.data.resources;
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

        // Create and app instance
        this.createServiceInstance = function(requestBody) {
            return $http.post("/v2/service_instances?accepts_incomplete=true", requestBody)
                .then(function(response) {
                    return response;
                }, function(response) {
                    return response;
                });
        };

        // Given an org guid attempts to find the active org data stored in the service
        this.findActiveOrg = function(orgGuid, callback) {
            if (orgs) {
                return callback(filterOrg(orgs, orgGuid));
            } else {
                return this.getOrgs().then(function(orgs) {
                    callback(filterOrg(orgs, orgGuid));
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
	}
	// Internal generic function that actually submits the request to backend to change the app.
	var changeAppState = function(app, desired_state) {
		setPollAppStatusProperty(false); // prevent UI from refreshing.
		return $http.put("/v2/apps/" + app.guid + "?async=false&inline-relations-depth=1", {"state":desired_state})
			.then(function(response) {
				// Success
				console.log("succeeded to change to " + desired_state);
				// Set the state immediately to stop so that UI will force a load of the new options.
				// UI will change the buttons based on the state.
				app.state = desired_state;
			}, function(response) {
				// Failure
				console.log("failed to change to " + desired_state);
			}).finally(function() {
				setPollAppStatusProperty(true); // allow UI to refresh via polling again.
			});
	}
	// Wrapper function that will submit a request to start an app.
	this.startApp = function(app) {
		return changeAppState(app, "STARTED");
	};
	// Wrapper function that will submit a request to stop an app.
	this.stopApp = function(app) {
		return changeAppState(app, "STOPPED");
	};
	// Wrapper function that will submit a request to restart an app.
	this.restartApp = function(app) {
		return changeAppState(app, "STOPPED")
			.then(changeAppState(app, "STARTED"));
	};

    });

}());
