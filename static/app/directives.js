(function() {
    'use strict';
    // Get the app
    var app = angular.module('cfdeck');


app.directive('serviceDestroyer', function($cloudfoundry) {
        var template = '<div><button type="button" class="btn btn-xs btn-primary" ng-click="view.showDestroyer(true)" ng-hide="view.confirmed">Delete Service Instance</button><div ng-show="view.confirmed"> Delete Service? <button type="button" class="btn btn-xs btn-danger" ng-click="view.deleteService(service)">Yes</button><button class="btn btn-xs btn-info" ng-click="view.showDestroyer(false)">No</button></div></div>'
        return {
            template: template,
            restrict: 'A',
            scope: {
                service: "=service",
            },
            controller: function($scope) {
                $scope.view = {
                    confirmed: false,
                };
                $scope.view.showDestroyer = function(state) {
                    $scope.view.confirmed = state;
                };
                $scope.view.deleteService = function(service) {
                    console.log(service);
                };
            }
        };
    });
}());
