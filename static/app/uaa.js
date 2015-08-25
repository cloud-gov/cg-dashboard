(function() {
	// UAA Service
	angular.module('cfdeck').service('$uaa', function($http) {
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
		this.getUserInfoGivenName = function() {
			return $http.get('/uaa/userinfo')
				.then(parseUserInfoGivenName, handleNoGivenName);
		};
		this.getUserInfoGuid = function() {
			return $http.get('/uaa/userinfo')
				.then(function(response) {
					return response.data.user_id;
				});
		};
		this.getUserGuidFromUserName = function(user) {
			return $http.post('/uaa/Users', {"userName": user.userName})
				.then(function(response) {
					user.id = response.data.resources[0].id;
					return user;
				});
		};

	});
}());
