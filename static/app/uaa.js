(function() {
    // UAA Service
    angular.module('cfdeck').service('$uaa', function($http, $q) {
        // Storage for user info
        var userInfoStorage;
        var parseUserInfoGivenName = function(response) {
            // Use the mandatory e-mail address if no given name is defined.
            if (response.data.given_name === undefined || response.data.given_name === null) {
                return response.data.email;
            }
            return response.data.given_name;
        };
        var handleNoGivenName = function(response) {
            if (response.status == 401 && response.data.status == "unauthorized") {
                return "noUser";
            }
            return 'User';
        }
        // Get user info only if it's not already in storage
        this.getUserInfo = function() {
            if (userInfoStorage) {
              var deferred = $q.defer();
              deferred.resolve(userInfoStorage);
              return deferred.promise;
            }
            else {
              return $http.get('/uaa/userinfo').then(function (response) {
                // Store user data
                userInfoStorage = response.data;
                return response
              });
            }
        };
        this.getUserInfoGivenName = function() {
            return this.getUserInfo().then(parseUserInfoGivenName, handleNoGivenName)
        };
        this.getUserInfoGuid = function() {
            return $http.get('/uaa/userinfo')
                .then(function(response) {
                    return response.data.user_id;
                });
        };
        this.getUserGuidFromUserName = function(user) {
            return $http.post('/uaa/Users', {
                    "userName": user.userName
                })
                .then(function(response) {
                    user.id = response.data.resources[0].id;
                    return user;
                });
        };

    });
}());
