// CF service method mocks
getAuthStatus = function() {
    return {
        then: function(callback) {
            return callback('authenticated');
        }
    }
};

var getOrgsData = function(callback) {
    return callback([{
        name: 'org1',
    }, {
        name: 'org2'
    }]);
};

var setOrgsData = function() {};

var getOrgDetails = function() {
    return {
        then: function(callback) {
            return callback({
                guid: 'mockguid',
                name: 'mockname',
                spaces: []
            });
        }
    }
}


// Location path mock
var path = function(callback) {
    return callback()
}

describe('HomeCtrl', function() {

    var scope, cloudfoundry;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        // Mock Cf service
        cloudfoundry = {
            getAuthStatus: getAuthStatus
        };
        // Spyon and return promise
        spyOn(cloudfoundry, 'getAuthStatus').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('HomeCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        });

    }));

    it('should return the authentication status from the cf service', function() {
        expect(scope.backendStatus).toBe('authenticated');
    })
});

describe('DashboardCtrl', function() {

    var scope, cloudfoundry, location;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        // Mock cloudfoundry service 
        cloudfoundry = {
                getOrgsData: getOrgsData,
                setOrgsData: setOrgsData
            }
            // Mock location service
        location = {
                path: path
            }
            //Load Ctrl and scope with mock service
        scope = $rootScope.$new();

        ctrl = $controller('DashboardCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $location: location
        });
    }));

    it('should place orgs into the scope', function() {
        expect(scope.orgs).toEqual([{
            name: 'org1'
        }, {
            name: 'org2'
        }]);
    });

    it('should send the user to the org view', function() {
        spyOn(location, 'path');
        scope.showOrg({
            metadata: {
                guid: 'mockguid'
            }
        });
        expect(location.path).toHaveBeenCalledWith('/dashboard/org/mockguid');
    });
});

describe('OrgCtrl', function() {

    var scope, cloudfoundry, location;

    beforeEach(module('cfdeck'))
    describe('when the org is avaiable', function() {

        beforeEach(inject(function($rootScope, $controller) {
            cloudfoundry = {
                getOrgsData: getOrgsData,
                setOrgsData: setOrgsData,
                getOrgDetails: getOrgDetails
            };
            location = {
                path: path
            };

            // Spyon and return promise
            spyOn(cloudfoundry, 'getOrgDetails').and.callThrough();

            // Load Ctrl and scope
            scope = $rootScope.$new();
            ctrl = $controller('OrgCtrl', {
                $scope: scope,
                $cloudfoundry: cloudfoundry,
                $location: location
            });
        }));

        it('should place orgs into the scope', function() {
            expect(scope.orgs).toEqual([{
                name: 'org1'
            }, {
                name: 'org2'
            }]);
        });

        it('should place the active org into the scope', function() {
            expect(scope.activeOrg).toEqual('mockname');
            expect(scope.spaces).toEqual([]);
        });

        it('should send the user to the org view', function() {
            spyOn(location, 'path');
            scope.showOrg({
                metadata: {
                    guid: 'mockguid'
                }
            });
            expect(location.path).toHaveBeenCalledWith('/dashboard/org/mockguid');
        });

    });

    describe('when the org is not avaiable', function() {

        beforeEach(inject(function($rootScope, $controller) {


            cloudfoundry = {
                getOrgsData: getOrgsData,
                setOrgsData: setOrgsData,
                getOrgDetails: function() {
                    return {
                        then: function(callback) {
                            return callback({'code': 30003});
                        }
                    }
                }

            };
            location = {
                path: path
            };

            // Spyon and return promise
            spyOn(cloudfoundry, 'getOrgDetails').and.callThrough();

            // Load Ctrl and scope
            scope = $rootScope.$new();
            ctrl = $controller('OrgCtrl', {
                $scope: scope,
                $cloudfoundry: cloudfoundry,
                $location: location
            });
        }));


        it('should place the active org into the scope', function() {
            expect(scope.activeOrg).toEqual('404');
            expect(scope.spaces).toEqual(undefined);
        });

    })



});

// TODO: fix spaces
describe('SpaceController', function() {

    var scope, cloudfoundry;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            getSpaceDetails: function() {
                return {
                    then: function(callback) {
                        return callback([{
                            entity: {
                                name: 'app1'
                            }
                        }, {
                            entity: {
                                name: 'app2'
                            }
                        }]);
                    }
                }
            }
        }

        spyOn(cloudfoundry, 'getSpaceDetails').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('SpaceController', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        });

    }));

    it('should return a space\'s apps', function() {
        expect(scope.apps).toEqual([{
            entity: {
                name: 'app1'
            }
        }, {
            entity: {
                name: 'app2'
            }
        }])
    });

    it('should set an active space if selected', function() {
        // Create a mock active space
        scope.activeSpaces = [{
            metadata: {
                guid: 'app1'
            }
        }, {
            metadata: {
                guid: 'app2'
            }
        }]
        scope.space = {
            metadata: {
                guid: 'app1'
            },
            selected: false
        }
        scope.setActiveSpace()
        expect(scope.activeSpaces[0].selected).toEqual(true);

    });

});
