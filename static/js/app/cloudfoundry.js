(function() {
    // CloudFoundry Service
    var cloudfoundry = function($http, $location) {

        // Redirects back to home page
        var returnHome = function(response) {
            $location.path('/');
        }

        // returns the authentication status from promise
        var returnAuthStatus = function(response) {
            return response.data.status
        }

        // Get current authentication status from server
        var getAuthStatus = function() {
            return $http.get('/v2/authstatus')
                .then(returnAuthStatus, returnAuthStatus);
        };

        // Get organizations
        var getOrgs = function() {
            return $http.get('/v2/organizations')
                .then(function(response) {
                    return response.data.resources;
                }, returnHome);
        };
        // Get organization spaces details
        var getOrgSpaceDetails = function(org) {
            return $http.get(org.entity.spaces_url)
                .then(function(response) {
                    var data = response.data;
                    data.org_name = org.entity.name;
                    return data;
                }, returnHome);
        };
        // Get space details
        var getSpaceDetails = function(space) {
            return $http.get(space.entity.apps_url)
                .then(function(response) {
                    if (response.data.resources.length > 0) {
                        return response.data.resources;
                    }
                    return "noApps";
                }, returnHome);
        };

	// Tells whether the web app should poll for newer app statuses.
	// Useful for when we are in the middle of updating the app status ourselves and we don't
	// want a poll to interrupt the UI.
	var pollAppStatus = true;
	// Getter function for pollAppStatus.
	var getPollAppStatusProperty = function() {
		return pollAppStatus;
	};
	// Setter function for pollAppStatus.
	var setPollAppStatusProperty = function(value) {
		pollAppStatus = value;
	}
	// Generic function that actually submits the request to backend to change the app.
	var changeAppState = function(app, desired_state) {
		setPollAppStatusProperty(false); // prevent UI from refreshing.
		return $http.put("/v2/apps/" + app.metadata.guid + "?async=false&inline-relations-depth=1", {"state":desired_state})
			.then(function(response) {
				// Success
				console.log("succeeded to change to " + desired_state);
				// Set the state immediately to stop so that UI will force a load of the new options.
				// UI will change the buttons based on the state.
				app.entity.state = desired_state;
			}, function(response) {
				// Failure
				console.log("failed to change to " + desired_state);
			}).finally(function() {
				setPollAppStatusProperty(true); // allow UI to refresh via polling again.
			});
	}
	// Wrapper function that will submit a request to start an app.
	var startApp = function(app) {
		return changeAppState(app, "STARTED");
	};
	// Wrapper function that will submit a request to stop an app.
	var stopApp = function(app) {
		return changeAppState(app, "STOPPED");
	};
	// Wrapper function that will submit a request to restart an app.
	var restartApp = function(app) {
		return changeAppState(app, "STOPPED")
			.then(changeAppState(app, "STARTED"));
	};
        return {
            getAuthStatus: getAuthStatus,
            getOrgs: getOrgs,
            getOrgSpaceDetails: getOrgSpaceDetails,
            getSpaceDetails: getSpaceDetails,
            startApp: startApp,
            restartApp: restartApp,
            stopApp: stopApp,
            getPollAppStatusProperty: getPollAppStatusProperty,
            setPollAppStatusProperty: setPollAppStatusProperty
        };

    };

    // Register Service
    var module = angular.module('cfdeck');
    module.factory('$cloudfoundry', cloudfoundry);


}());
