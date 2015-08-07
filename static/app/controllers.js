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

    app.controller('MainCtrl', function($scope, $cloudfoundry, $location, MenuData) {
      // Render the orgs on the page
      var renderOrgs = function(orgs) {
          $scope.orgs = orgs;
          $cloudfoundry.setOrgsData(orgs);
      };

      // Get Orgs or return to login page
      $cloudfoundry.getOrgsData(renderOrgs);


      $scope.MenuData = MenuData;
    });

    function loadOrg(MenuData, $routeParams, $cloudfoundry, $scope) {
      var renderOrg = function(orgData) {
          if (orgData['code'] == 30003) {
            MenuData.data.currentOrg = "404";
          } else {
            MenuData.data.currentOrg = orgData;
            $scope.activeOrg = MenuData.data.currentOrg;
            $scope.spaces = $scope.activeOrg.spaces;
          }
      };
      $cloudfoundry.getOrgDetails($routeParams['orgguid']).then(renderOrg);
    }

    app.controller('OrgCtrl', function($scope, $cloudfoundry, $location, $routeParams, MenuData) {
        // Render the org information on the page
        loadOrg(MenuData, $routeParams, $cloudfoundry, $scope);


        $scope.visibleTab = "organizations";

    });

    app.controller('SpaceCtrl', function($scope, $cloudfoundry, $location, $routeParams) {
        // Render the active org
        var renderActiveOrg = function(org) {
                $scope.activeOrg = org;
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
        // Render the active org
        var renderActiveOrg = function(org) {
            $scope.activeOrg = org;
        }
        // Show a specific service details by going to service landing page
        $scope.showService = function(service) {
            $location.path($location.path() + '/' + service.metadata.guid);
        };
        // Get all the services associated with an org
        $cloudfoundry.getOrgServices($routeParams['orgguid']).then(function(services) {
            $scope.services = services;
        });
        // Find the active org from an org guid
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderActiveOrg);
        // Show the `marketplace.html` view
        $scope.visibleTab = 'marketplace';
    });

    app.controller('ServiceCtrl', function($scope, $cloudfoundry, $routeParams) {
        // Render the active org
        var renderActiveOrg = function(org) {
            $scope.activeOrg = org;
        }
        // Send service plans to the view
        var renderServicePlans = function(servicePlans) {
            $scope.plans = servicePlans;
        };
        // Render service details and request service plans
        var renderService = function(service) {
            $scope.service = service;
            // Show the `service.html` view
            $scope.visibleTab = 'service';
            $cloudfoundry.getServicePlans(service.entity.service_plans_url).then(renderServicePlans);
        };
        // Get service details
        $cloudfoundry.getServiceDetails($routeParams['serviceguid']).then(renderService);
        // Find the active org from an org guid
        $cloudfoundry.findActiveOrg($routeParams['orgguid'], renderActiveOrg);
    });

}());
