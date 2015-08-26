(function() {
    'use strict';
    // Get the app
    var app = angular.module('cfdeck');


    app.directive('serviceDestroyer', function($cloudfoundry, $route) {
        return {
            templateUrl: 'app/views/partials/service_destroyer.html',
            controller: function($scope) {
                $scope.view = {
                    status: 'unconfirmed',
                    disableButton: false,
                };
                $scope.view.showDestroyer = function(state) {
                    $scope.view.status = state;
                };
                $scope.view.deleteService = function(service, bound) {
                    $scope.view.disableButton = true;
                    $cloudfoundry.deleteServiceInstance(service, bound)
                        .then(function(response) {
                            if (response.code === undefined) {
                                $scope.view.status = "success";
                                $route.reload();
                            } else if (response.code === 10006) {
                                $scope.view.status = "boundError";
                            } else {
                                $scope.view.status = "error";
                            }
                             $scope.view.disableButton = false;
                        });
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
