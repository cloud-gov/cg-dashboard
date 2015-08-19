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
		this.getUserGuidFromEmail = function(user) {
			return $http.post('/uaa/Users', {"email": user.email})
				.then(function(response) {
					console.log(response.data.resources);
					user.id = response.data.resources[0].id;
					console.log(user);
					return user;
				});
		};

	});
}());
