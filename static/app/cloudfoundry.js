(function() {
    // CloudFoundry Service
    angular.module('cfdeck').service('$cloudfoundry', function($http, $location, $log, $q) {

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

        // Delete Route
        this.deleteRoute = function(oldRoute) {
            return $http.delete('/v2/routes/' + oldRoute.guid)
                .then(function(response) {
                    return response.data;
                });
        };

        // Delete Route
        this.createRoute = function(newRoute, appGuid) {
            // Create the route
            return $http.post('/v2/routes', newRoute)
                .then(function(response) {
                    // Map the route to the app
                    return $http.put(response.data.metadata.url + '/apps/' + appGuid)
                        .then(function(response) {
                            return response.data;
                        });
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

        // Get an org's links
        this.getOrgLinks = function(org) {
            return $http.get('/v2/organizations/' + org.guid)
        };

        // Get quota usage data
        this.getQuotaUsage = function(org) {
            
            var quotadata = {};
            // Get a quota's memory limit
            var getMemoryLimit = function(response) {
                return $http.get(response.data.entity.quota_definition_url)
                    .then(function(response) {
                        quotadata.memory_limit = response.data.entity.memory_limit;
                    });
            };
            // Get a quota's memory usage
            var getOrgMemoryUsage = function() {
                return $http.get('/v2/organizations/' + org.guid + '/memory_usage')
                    .then(function(response) {
                        quotadata.used_memory = response.data.memory_usage_in_mb;
                    });
            };
            // Attached quota data, only if all promises succeed
            this.getOrgLinks(org)
                .then(getMemoryLimit)
                .then(getOrgMemoryUsage)
                .then(function () {
                    org.quota = quotadata;
                })
                .catch(function () {
                    $log.info('Failed to get quota usage');
                });
        };

	// Get org users
        this.getOrgUsers = function(orgGuid) {
            return $http.get('/v2/organizations/' + orgGuid + '/users')
                .then(function(response) {
                    return response.data.resources;
                });
        };

	// Generic function to get different org user categories
        this.getOrgUserCategory = function(orgGuid, userGuid, category, queryString) {
            return $http.get('/v2/organizations/' + orgGuid + '/'+category+'?'+queryString+'=' +userGuid)
                .then(function(response) {
                    return response.data.resources;
                });
        };

	// Generic function to add different org user categories
        this.addOrgUserCategory = function(orgGuid, userGuid, category) {
            return $http.put('/v2/organizations/' + orgGuid + '/'+category+'/'+ userGuid)
                .then(function(response) {
                    return response.data.resources;
                });
        };

	// Generic function to delete different org user categories
        this.deleteOrgUserCategory = function(orgGuid, userGuid, category) {
            return $http.delete('/v2/organizations/' + orgGuid + '/'+category+'/'+ userGuid)
                .then(function(response) {
                    return response.data.resources;
                });
        };

	// Generic function to set different org user categories.
	// Will add the category if 'adding' is true, otherwise, will delete.
        this.setOrgUserCategory = function(orgGuid, userGuid, category, adding) {
            if (adding) {
                return this.addOrgUserCategory(orgGuid, userGuid, category);
            } else {
                return this.deleteOrgUserCategory(orgGuid, userGuid, category);
            }
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

        // Delete unbound service Instance
        var deleteUnboundServiceInstance = function(service) {
            return $http.delete(service.metadata.url)
                .then(function(response) {
                    return response.data;
                }, function(response) {
                    return response.data;
                });
        };


        // Delete bound service instance, by undinding all services first
        var deleteBoundServiceInstance = function(service) {
            return $http.get(service.entity.service_bindings_url)
                .then(function(response) {
                    // Collect promises
                    var requestsPromises = response.data.resources.map(function(boundService) {
                        return $http.delete(boundService.metadata.url)
                    });
                    // Run promises and then delete service instance
                    return $q.all(requestsPromises)
                        .then(function() {
                            return deleteUnboundServiceInstance(service)
                        });
                });
        };

        // Delete a service instance
        this.deleteServiceInstance = function(service, bound) {
            if (!bound) {
                return deleteUnboundServiceInstance(service);
            } else {
                return deleteBoundServiceInstance(service);
            }
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

        // Get service credentials
        this.getServiceCredentials = function(service) {
            // Look for service binding guid
            return $http.get(service.entity.service_bindings_url)
                .then(function(response) {
                    // Find the service binding that is attached to the current space
                    return response.data.resources.filter(function(boundService) {
                        return boundService.entity.space_guid === service.space_guid;
                    })[0].entity.credentials;
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
