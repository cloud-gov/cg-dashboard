(function() {
    // UAA Service
    angular.module('cfdeck').service('$uaa', function($http, $q) {
        var self = this;
        // Storage for user info, org, and space permissions
        var userInfoStorage, userPermissions = {};

        // Extract the username from user data
        var parseUserInfoGivenName = function(response) {
            // Use the mandatory e-mail address if no given name is defined.
            if (response.data.given_name === undefined || response.data.given_name === null) {
                return response.data.email;
            }
            return response.data.given_name;
        };

        // Extract temp, username from userinfo data that doesn't have user name
        var handleNoGivenName = function(response) {
            if (response.status == 401 && response.data.status == "unauthorized") {
                return "noUser";
            }
            return 'User';
        }

        // Get user info only if it's not already in storage
        self.getUserInfo = function() {
            if (userInfoStorage) {
              var deferred = $q.defer();
              deferred.resolve(userInfoStorage);
              return deferred.promise;
            }
            else {
              return $http.get('/uaa/userinfo').then(function (response) {
                // Store user data
                userInfoStorage = response;
                return response
              });
            }
        };

        self.getUsersPermissions = function (endpoint, refresh) {
          refresh = refresh || false;
          if (userPermissions[endpoint] && !refresh) {
            var deferred = $q.defer();
            deferred.resolve(userPermissions[endpoint]);
            return deferred.promise;
          }
          else {
            return self.getUserInfo().then(function (response) {
              return $http.get('/v2/users/' + response.data.user_id + '/' + endpoint)
                .then(function (response) {
                  userPermissions[endpoint] = response.data.resources.map(function (org) {
                    return org.metadata.guid;
                  });
                  return userPermissions[endpoint];
                });
            });
          }
        };
        // Check if the user has permissions in a particular space or org
        self.findUserPermissions = function (guid, endpoint, refresh) {
            return self.getUsersPermissions(endpoint, refresh).then(function (permissions) {
              if (permissions.indexOf(guid) === -1) {
                return false;
              }
              else {
                return true;
              };
            });
        };

        // Get the users login info
        self.getUserInfoGivenName = function() {
            return self.getUserInfo().then(parseUserInfoGivenName, handleNoGivenName)
        };

        // Get a user's guid from the /uaa endpoint using the username
        self.getUserGuidFromUserName = function(user) {
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
