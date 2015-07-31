(function() {
    // CloudFoundry Service
    angular.module('cfdeck').service('$cloudfoundry', function($http, $location, $log) {
        // Redirects back to home page
        var returnHome = function(response) {
            $location.path('/');
            return {'status': 'unauthorized'};
        }

        // returns the authentication status from promise
        var returnAuthStatus = function(response) {
            return response.data.status
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
            console.log(org.entity.spaces_url);
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

        // Declare variables for passing data via this service
        var orgs;
        var spaces;
        var apps;

        // Functions for getting passed data
        this.setOrgsData = function(newOrgs) {
            orgs = newOrgs
        };
        this.getOrgsData = function(callback) {
            if (!orgs) {
                $log.info('Downloaded New Org Data');
                return this.getOrgs().then(callback);
            }
            $log.info('Used cached data');
            return callback(orgs);
        }
    });

}());
