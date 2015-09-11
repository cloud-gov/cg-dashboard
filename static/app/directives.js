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
            controller: function($scope, $location) {
                // Render the orgs on the page
                var renderOrgs = function(orgs) {
                    $scope.orgs = orgs;
                    $cloudfoundry.setOrgsData(orgs);
                };
                var renderName = function(name) {
                    $scope.givenName = name;
                    // Load user's permissions
                    $uaa.getUsersPermissions('managed_organizations')
                        // Only allow navigation when names are loaded
                    $scope.authorized = true;
                };
                // Get the auth status
                $cloudfoundry.getAuthStatus().then(function(status) {
                    if (status === "authorized") {
                        // Load the org data
                        $cloudfoundry.getOrgsData(renderOrgs);
                        // Load username
                        $uaa.getUserInfoGivenName().then(renderName);
                    } else {
                        $scope.authorized = false;
                        $location.path('/');
                    }
                });
            }
        };
    });
    // http://stackoverflow.com/questions/20792325/angularjs-and-google-analytics
    app.directive('analytics', function() {
        return {
            restrict: 'A',
            scope: {
                id: '=analytics'
            },
            link: function(scope, iElement, iAttrs) {
                (function(i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function() {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

                scope.$watch('id', function(newId, oldId) {
                    if (newId) {
                        ga('create', scope.id, {
                            'cookieDomain': 'none'
                        });
                        ga('set', 'anonymizeIp', true);
                        ga('set', 'forceSSL', true);
                    }
                });
            }
        };
    });

}());
