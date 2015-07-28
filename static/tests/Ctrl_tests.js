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
            },
            getOrgSpaceDetails: function(org) {

                return {
                    then: function(callback) {
                        if (org.name == 'org1') {
                            spaces = [];
                        } else if (org.name == 'org2') {
                            spaces = ['space1', 'space2'];
                        }
                        return callback({
                            org_name: 'org1',
                            resources: spaces
                        })
                    }
                }
            }

        };
        // Spyon and return promise
        spyOn(cloudfoundry, 'getOrgs').and.callThrough();
        spyOn(cloudfoundry, 'getOrgSpaceDetails').and.callThrough();

        //Load Ctrl and scope with mock service
        scope = $rootScope.$new();
        ctrl = $controller('DashboardCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        });

    }));

    it('should return the user\'s orgs from the cloudfoundry service', function() {
        expect(scope.orgs).toEqual([{
            name: 'org1'
        }, {
            name: 'org2'
        }]);
    });

    describe('showOrgs and renderOrgDetails', function() {

        it('should return a specific org\'s details without spaces', function() {

            // Call showOrg function
            scope.showOrg({
                name: 'org1'
            });
            expect(scope.orgDropDownName).toEqual('org1');
            expect(scope.activeSpaces).toEqual(null);
        })

        it('should return a specific org\'s details with spaces', function() {

            scope.showOrg({
                name: 'org2'
            });
            expect(scope.orgDropDownName).toEqual('org1');
            expect(scope.activeSpaces).toEqual(['space1', 'space2']);

        })
    });

    describe('clearDashboard', function() {

        it('should clear the visible tab, active org, and org dropdown name', function() {
            // Set the variables to be cleared
            scope.visibleTab = 'tab1';
            scope.activeOrg = 'org1';
            scope.orgDropDownName = 'org1';
            // Clear the variables
            scope.clearDashboard();
            // Show vars cleared
            expect(scope.visibleTab).toEqual(null);
            expect(scope.activeOrg).toEqual(null);
            expect(scope.orgDropDownName).toEqual(null);

        });

    });


});
