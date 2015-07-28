describe('HomeCtrl', function() {

    var scope, cloudfoundry;

    beforeEach(module('cfconsole'));
    beforeEach(inject(function($rootScope, $controller) {
        // Mock Cf service
        cloudfoundry = {
            getAuthStatus: function() {
                return {
                    then: function(callback) {
                        return callback('authenticated');
                    }
                }
            },
        };
        // Spyon and return promise
        spyOn(cloudfoundry, 'getAuthStatus').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('HomeCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        })

    }));

    it('should return the authentication status from the cf service', function() {
        expect(scope.backendStatus).toBe('authenticated');
    })
});


describe('DashboardCtrl', function() {

    var scope, cloudfoundry;

    beforeEach(module('cfconsole'));
    beforeEach(inject(function($rootScope, $controller) {
        // Mock cf service
        cloudfoundry = {
                getOrgs: function() {
                    return {
                        then: function(callback) {
                            return callback([{
                                name: 'org1'
                            }, {
                                name: 'org2'
                            }]);
                        }
                    }
                }
            }
            // Spyon and return promise
        spyOn(cloudfoundry, 'getOrgs').and.callThrough();

        //Load Ctrl and scope with mock service
        scope = $rootScope.$new();
        ctrl = $controller('DashboardCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        })

    }));


    it('should return the user\'s orgs from the cloudfoundry service', function() {
        expect(scope.orgs).toEqual([{
            name: 'org1'
        }, {
            name: 'org2'
        }]);
    });
    
    


});




