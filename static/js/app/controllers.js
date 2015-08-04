(function() {
    'use strict';

    var app = angular.module('cfdeck');
    app.controller('HomeCtrl', function($scope, $cloudfoundry) {
        //Render the auth status of the backend
        var renderStatus = function(status) {
            $scope.backendStatus = status;
        };
        $cloudfoundry.getAuthStatus()
            .then(renderStatus);
    });

    app.controller('DashboardCtrl', function($scope, $cloudfoundry, $location) {
        // Render the orgs on the page
        var renderOrgs = function(orgs) {
            $scope.orgs = orgs;
            $cloudfoundry.setOrgsData(orgs);
        };
        // Get data for a specific org
        $scope.showOrg = function(org) {
            if (org.metadata)
                $location.path('/dashboard/org/' + org.metadata.guid);
            else
                $location.path('/dashboard/org/' + org.guid);
        };
        $scope.showOrgMarketplace = function(org) {
            if (org.metadata)
                $location.path('/dashboard/org/' + org.metadata.guid + '/marketplace');
            else
                $location.path('/dashboard/org/' + org.guid + '/marketplace');

        };

        // Get Orgs or return to login page
        $cloudfoundry.getOrgsData(renderOrgs);
    });

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        // Display Space
        $scope.showSpace = function(space) {
            $location.path($location.path() + '/spaces/' + space.guid)
        };
        // Render the org information on the page
        var renderOrg = function(orgData) {
            if (orgData['code'] == 30003) {
                $scope.activeOrg = "404";

            } else {
                $scope.activeOrg = orgData;
                $scope.spaces = orgData.spaces
            }
        };
        // Get Orgs or return to login page
        $cloudfoundry.getOrgDetails($routeParams['guid']).then(renderOrg)
        $scope.visibleTab = "organizations";

    });

    app.controller('SpaceCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        // Render the active org
        var renderActiveOrg = function(org) {
            $scope.activeOrg = org.entity.name;
        }
        // Render a space in the view
        var renderSpace = function(space) {
            $scope.space = space;
        };
        //TODO: show an app
        $scope.showApp = function(app) {
            console.log("show app: " + app.name);
        };
        // Get the orgs data from cache or load new data
        $cloudfoundry.getSpaceDetails($routeParams['spaceguid'])
            .then(renderSpace);
        // Return the active org 
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderActiveOrg);
        $scope.visibleTab = "spaces";
    });

    app.controller('MarketCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        // Render an org data, but look for orgGuid instead of loading all org data
        var renderOrgs = function(orgs) {
            var activeOrg = orgs.filter(function(org) {
                return org.metadata.guid === $routeParams['orgguid'];
            });
            $scope.activeOrg = activeOrg[0];
        };
        $scope.showService = function(service) {
            $location.path($location.path() + '/' + service.metadata.guid);
        };
        $cloudfoundry.getOrgServices($routeParams['orgguid']).then(function(services) {
            $scope.services = services;
        });

        $cloudfoundry.getOrgsData(renderOrgs);
        $scope.visibleTab = 'marketplace';
    });

    app.controller('ServiceCtrl', function($scope, $cloudfoundry, $routeParams) {
        // Render an org data, but look for orgGuid instead of loading all org data
        var renderOrgs = function(orgs) {
            var activeOrg = orgs.filter(function(org) {
                return org.metadata.guid === $routeParams['orgguid'];
            });
            $scope.activeOrg = activeOrg[0];
        };
        var renderServicePlans = function(servicePlans) {
            $scope.plans = servicePlans;
        };

        var renderService = function(service) {
            $scope.service = service;
            $scope.visibleTab = 'service';
            $cloudfoundry.getServicePlans(service.entity.service_plans_url).then(renderServicePlans);
        };

        $cloudfoundry.getServiceDetails($routeParams['serviceguid']).then(renderService);
        // Get Orgs or return to login page
        $cloudfoundry.getOrgsData(renderOrgs);
        $scope.visibleTab = "spaces";
    });

}());
