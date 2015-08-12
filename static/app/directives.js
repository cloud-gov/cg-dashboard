(function() {
    'use strict';
    // Get the app
    var app = angular.module('cfdeck');


    app.directive('serviceDestroyer', function($cloudfoundry) {
        return {
            templateUrl: 'app/views/partials/service_destroyer.html',
            restrict: 'A',
            scope: {
                service: "=service",
            },
            controller: function($scope) {
                $scope.view = {
                    status: 'unconfirmed',
                };
                $scope.view.showDestroyer = function(state) {
                    $scope.view.status = state;
                };
                $scope.view.deleteService = function(service) {
                    $cloudfoundry.deleteServiceInstance(service)
                        .then(function(response) {
                            if (response.code === undefined) {
                                $scope.view.status = "success";
                                $scope.view.message = "Deleted!";
                            } else if (response.code === 10006) {
                                $scope.view.status = "error";
                                $scope.view.message = "This service is bound to one or more apps";
                            } else {
                                $scope.view.status = "error";
                                $scope.view.message = "Unknown error, try refreshing."
                            }                             
                        })
                };
            }
        };
    });
    app.directive('deckHeader', function($cloudfoundry, $uaa) {
        return {
            templateUrl: 'app/views/partials/header.html',
            restrict: 'A',
            controller: function($scope) {
               // Render the given name of the user on the page
                var renderName = function(name) {
                    $scope.givenName = name;
                };
		$cloudfoundry.isAuthorized()
			.then(function(authorized) {
				$scope.authorized = authorized;
				if (authorized == true) {
					// Load the given name of the logged in user.
					$uaa.getUserInfoGivenName().then(renderName);
				}
			});
            }
        };
    });
}());
