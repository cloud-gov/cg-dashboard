(function() {
    var app = angular.module('cfdeck', ['ngRoute', 'angular-ladda', 'ngSanitize', 'mwl.confirm', 'toggle-switch']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/index.html',
            })
            .when('/dashboard', {
                templateUrl: 'app/views/dashboard.html',
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
            .when('/org/:orgguid/manage-org', {
                templateUrl: 'app/views/manage_org.html',
                controller: 'OrgManagementCtrl'
            })
            .when('/org/:orgguid/manage-org/:userguid', {
                templateUrl: 'app/views/manage_org_user.html',
                controller: 'OrgUserManagementCtrl'
            })
            .when('/org/:orgguid/spaces/:spaceguid', {
                templateUrl: 'app/views/spaces.html',
                controller: 'SpaceCtrl'
            })
            .when('/org/:orgguid/spaces/:spaceguid/services', {
                templateUrl: 'app/views/spaces_services.html',
                controller: 'SpaceServicesCtrl'
            })
            .when('/org/:orgguid/spaces/:spaceguid/users', {
                templateUrl: 'app/views/spaces_users.html',
                controller: 'SpaceUserCtrl'
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
