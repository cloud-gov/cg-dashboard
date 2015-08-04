(function() {
    var app = angular.module('cfdeck', ['ngRoute']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'js/app/partials/index.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'js/app/partials/login.html',
                controller: 'LoginCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'js/app/partials/dashboard.html'
            })
            .when('/dashboard/org/:guid', {
                templateUrl: 'js/app/partials/dashboard.html',
                controller: 'OrgCtrl'
            })
            .when('/dashboard/org/:orgguid/spaces/:spaceguid', {
                templateUrl: 'js/app/partials/dashboard.html',
                controller: 'SpaceCtrl'
            })
            .otherwise({
                redirectTo: "/"
            });
    });
}());
