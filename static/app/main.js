(function() {
    var app = angular.module('cfdeck', ['ngRoute', 'angular-ladda', 'ngSanitize', 'mwl.confirm', 'toggle-switch']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/index.html',
            })
            .when('/dashboard', {
                templateUrl: 'app/views/dashboard.html',
                controller: 'DashboardCtrl',
            })
            .when('/org/:orgguid/spaces', {
                redirectTo: "/org/:orgguid"
            })
            .when('/org/:orgguid', {
                templateUrl: 'app/views/organizations.html',
                controller: 'OrgCtrl' // TODO Rename to OrgSpaces
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
                controller: 'SpaceCtrl' // TODO Rename to SpaceApps
            })
            .when('/org/:orgguid/spaces/:spaceguid/apps', {
                redirectTo: "/org/:orgguid/spaces/:spaceguid"
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
    app.config(function($httpProvider) {
        $httpProvider.interceptors.push(function($q, $injector, $location) {
            return {
                responseError: function(rejection) {
                    if (rejection.status === 404) {
                        // Check to make sure if we aren't at the root.
                        if ($location.path() != "/") {
                            // Go up one directory if not found.
                            var arr = window.location.href.split("/");
                            delete arr[arr.length - 1];
                            window.location.assign(arr.join("/"));
                            // Make sure the page is reloaded to reflect the new values.
                            window.location.reload();
                        }
                    }

                    /* If not a 401, do nothing with this error.
                     * This is necessary to make a `responseError`
                     * interceptor a no-op. */
                    return $q.reject(rejection);
                }
            };
        });
    });
}());
