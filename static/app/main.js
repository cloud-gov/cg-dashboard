(function() {
    var app = angular.module('cfdeck', ['ngRoute', 'angular-ladda']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/index.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'app/views/dashboard.html',
                controller: 'HomeCtrl'
            })
            .when('/org/:orgguid', {
                templateUrl: 'app/views/organizations.html',
                controller: 'OrgCtrl'
            })
            .when('/org/:orgguid/marketplace', {
                templateUrl: 'app/views/marketplace.html',
                controller: 'MarketCtrl'
            })
            .when('/org/:orgguid/marketplace/:serviceguid', {
                templateUrl: 'app/views/service.html',
                controller: 'ServiceCtrl'
            })
            .when('/org/:orgguid/spaces/:spaceguid', {
                templateUrl: 'app/views/spaces.html',
                controller: 'SpaceCtrl'
            })
            .when('/org/:orgguid/spaces/:spaceguid/apps/:appguid', {
                templateUrl: 'app/views/app.html',
                controller: 'AppCtrl'
            })
            .otherwise({
                redirectTo: "/"
            });
    });
}());
