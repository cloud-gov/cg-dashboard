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

        return {
            getAuthStatus: getAuthStatus,
            getOrgs: getOrgs,
            getOrgSpaceDetails: getOrgSpaceDetails,
            getSpaceDetails: getSpaceDetails
        };

    };

    // Register Service
    var module = angular.module('cfdeck');
    module.factory('$cloudfoundry', cloudfoundry);


}());
