// CF service method mocks
getAuthStatus = function() {
    return {
        then: function(callback) {
            return callback('authenticated');
        }
    }
};

var getOrgsData = function(callback) {
    return callback(
        [{
            entity: {
                name: 'org1'
            },
            metadata: {
                guid: 'org1guid'
            }
        }, {
            entity: {
                name: 'org1'
            },
            metadata: {
                guid: 'org2guid'
            }
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

var getSpaceDetails = function(spaceguid) {
    return {
        then: function(callback) {
            return callback({
                guid: 'spaceguid',
                name: 'spacename',
                apps: [{
                    name: 'mockname1'
                }, {
                    name: 'mockname2'
                }]
            });
        }
    }

};

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
        expect(scope.orgs).toEqual(
            [{
                entity: {
                    name: 'org1'
                },
                metadata: {
                    guid: 'org1guid'
                }
            }, {
                entity: {
                    name: 'org1'
                },
                metadata: {
                    guid: 'org2guid'
                }
            }]
        );
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

        it('should place the active org into the scope', function() {
            expect(scope.activeOrg).toEqual('mockname');
            expect(scope.spaces).toEqual([]);
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
                            return callback({
                                'code': 30003
                            });
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

        it('should send the user to the space view', function() {
            spyOn(location, 'path');
            scope.showSpace({
                guid: 'spaceguid'
            });
            expect(location.path).toHaveBeenCalledWith('undefined/spaces/spaceguid');
        });
    });
});

describe('SpaceCtrl', function() {

    var scope, cloudfoundry;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            getOrgsData: getOrgsData,
            getSpaceDetails: getSpaceDetails
        }

        spyOn(cloudfoundry, 'getSpaceDetails').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('SpaceCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                orgguid: 'org1guid',
                spaceguid: 'spaceguid'
            }
        });

    }));

    it('should return a space\'s summary info', function() {
        expect(scope.space).toEqual({
            guid: 'spaceguid',
            name: 'spacename',
            apps: [{
                name: 'mockname1'
            }, {
                name: 'mockname2'
            }]
        })
    });
});
