(function() {
    // CloudFoundry Service
    var cloudfoundry = function($http) {

        // Get current authentication status from server
        var getAuthStatus = function() {
            return $http.get('/v2/authstatus')
                .then(function(response) {
                    return response.data.status;
                }, function(response) {
                    return response.data.status;
                });
        };

        // Get organizations
        var getOrgs = function() {
            return $http.get('/v2/organizations')
                .then(function(response) {
                    return response.data.resources;
                });
        };
        // Get organization spaces details
        var getOrgSpaceDetails = function(org) {
            return $http.get(org.entity.spaces_url)
                .then(function(response) {
                    var data = response.data;
                    data.org_name = org.entity.name;
                    return data;
                });
        };
        // Get space details
        var getSpaceDetails = function(space) {
            console.log(space);
            return $http.get(space.entity.apps_url)
                .then(function(response) {
                    if (response.data.resources.length > 0) {
                        return response.data.resources;
                    }
                    return "noApps";
                });
        };

        return {
            getAuthStatus: getAuthStatus,
            getOrgs: getOrgs,
            getOrgSpaceDetails: getOrgSpaceDetails,
            getSpaceDetails: getSpaceDetails
        };

    };

    // Register Service
    var module = angular.module('cfconsole');
    module.factory('$cloudfoundry', cloudfoundry);


}());
