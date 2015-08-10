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
			return 'User';
		}
		this.getUserInfoGivenName = function() {
			return $http.get('/uaa/userinfo')
				.then(parseUserInfoGivenName, handleNoGivenName);
		};
	});
}());
