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

var findActiveOrg = function(orgguid, callback) {
    return callback({
        entity: {
            name: 'org1'
        }
    })
}
var getOrgServices = function() {
    return {
        then: function(callback) {
            return callback([{
                name: 'service1'
            }, {
                name: 'service2'
            }])
        }
    }
};

var getServiceDetails = function(serviceGuid) {
    return {
        then: function(callback) {
            return callback([{
                name: 'service1'
            }])
        }
    }
};

var getServiceDetails = function(serviceGuid) {
    return {
        then: function(callback) {
            return callback({
                entity: {
                    name: 'service1',
                    service_plans_url: '/v2/...'
                }
            })
        }
    }
};

var getServicePlans = function(serviceGuid) {
    return {
        then: function(callback) {
            return callback([{
                name: 'plan1'
            }])
        }
    }
};

var getOrgSpaces = function(spacesUrl) {
    return {
        then: function(callback) {
            return callback([{
                name: 'space1'
            }])
        }
    }
};

var createServiceInstance = function(serviceInstance) {
    return {
        then: function(callback) {
            return callback({
                status: 202
            })
        }
    }
};

var getPollAppStatusProperty = function() {
    return true;
}

var getAppSummary = function(appGuid) {
    return {
        then: function(callback) {
            return callback({
                name: 'app1',
                state: 'STARTED',
                running_instances: 1,
                instances: 1,
                memory: 1024,
                disk_quota: 1024,
                package_state: 'STAGED'
            })
        }
    }
};

var getAppStats = function(appGuid) {
    return {
        then: function(callback) {
            return callback([{
                name: 'app1',
                stats: {
                    usage: {
                        mem: 12345678,
                        mem_quota: 1234567890,
                        disk: 12345678,
                        disk_quota: 1234567890,
                        cpu: 0.1
                    }
                }
            }])
        }
    }
};

var restartApp = function(app) {
    return {
        then: function(callback) {
            return callback('');
        }
    }
};

var stopApp = function(app) {
    return {
        then: function(callback) {
            return callback('');
        }
    }
};

var startApp = function(app) {
    return {
        then: function(callback) {
            return callback('');
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
            expect(scope.activeOrg.name).toEqual('mockname');
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
            getSpaceDetails: getSpaceDetails,
            findActiveOrg: findActiveOrg
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

    it('should return the active org', function() {
        expect(scope.activeOrg.entity.name).toEqual('org1')
    });
});

describe('MarketCtrl', function() {
    var scope, cloudfoundry;
    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        //Mock CF service
        cloudfoundry = {
            getOrgServices: getOrgServices,
            findActiveOrg: findActiveOrg
        }

        spyOn(cloudfoundry, 'findActiveOrg').and.callThrough();
        spyOn(cloudfoundry, 'getOrgServices').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('MarketCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        });
    }));

    it('should put all the services into the space', function() {
        expect(scope.services.length).toEqual(2);
    });


    it('should open the services tab as the visible one', function() {
        expect(scope.visibleTab).toEqual('marketplace');
    });

    it('should return the active org', function() {
        expect(scope.activeOrg.entity.name).toEqual('org1')
    });

});


describe('ServiceCtrl', function() {
    var scope, cloudfoundry;
    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        //Mock CF service
        cloudfoundry = {
            getServiceDetails: getServiceDetails,
            getServicePlans: getServicePlans,
            findActiveOrg: findActiveOrg,
            getOrgSpaces: getOrgSpaces,
            createServiceInstance: createServiceInstance
        }

        spyOn(cloudfoundry, 'findActiveOrg').and.callThrough();
        spyOn(cloudfoundry, 'getServiceDetails').and.callThrough();
        spyOn(cloudfoundry, 'getServicePlans').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('ServiceCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        });
    }));

    it('should put the service details into the space', function() {
        expect(scope.service.entity.name).toEqual('service1');
    });

    it('should put the service plans data', function() {
        expect(scope.plans[0]).toEqual({
            name: 'plan1'
        });
    });

    it('should return the active org', function() {
        expect(scope.activeOrg.entity.name).toEqual('org1')
    });

    it('should show the service maker when showServiceMaker invoked by passing spaces, activePlan, and show serviceMaker', function() {
        scope.activeOrg = {
            entity: 'testurl'
        };
        scope.showServiceMaker({
            name: 'plan1'
        });
        expect(scope.spaces).toEqual([{
            name: 'space1'
        }]);
        expect(scope.activePlan).toEqual({
            name: 'plan1'
        })
    });

    it('should create an service instance when prompted and show create message', function() {
        scope.activePlan = {
            metadata: 'plan1guid'
        };
        scope.createServiceInstance({
            name: 'service1'
        });
    });
});

describe('AppCtrl', function() {
    var scope, cloudfoundry;
    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        //Mock CF service
        cloudfoundry = {
            stopApp: stopApp,
            startApp: startApp,
            restartApp: restartApp,
            getPollAppStatusProperty: getPollAppStatusProperty,
            getAppSummary: getAppSummary,
            getAppStats: getAppStats
        }

        // spyOn(cloudfoundry, 'stopApp').and.callThrough();
        // spyOn(cloudfoundry, 'startApp').and.callThrough();
        // spyOn(cloudfoundry, 'restartApp').and.callThrough();
        spyOn(cloudfoundry, 'getAppSummary').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('AppCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry
        });

    }));

    it('should put the app summary into the app', function() {
        expect(scope.appSummary.name).toEqual('app1');
        expect(scope.appSummary.state).toEqual('STARTED');
        expect(scope.appSummary.running_instances).toEqual(1);
        expect(scope.appSummary.instances).toEqual(1);
        expect(scope.appSummary.memory).toEqual(1024);
        expect(scope.appSummary.disk_quota).toEqual(1024);
        expect(scope.appSummary.package_state).toEqual('STAGED');
    });

    it('should put the app stats into the app', function() {
        expect(scope.appStats[0].name).toEqual('app1');
        expect(scope.appStats[0].stats.usage.mem).toEqual(12345678);
        expect(scope.appStats[0].stats.usage.mem_quota).toEqual(1234567890);
        expect(scope.appStats[0].stats.usage.disk).toEqual(12345678);
        expect(scope.appStats[0].stats.usage.disk_quota).toEqual(1234567890);
        expect(scope.appStats[0].stats.usage.cpu).toEqual(0.1);
    });

    it('should open the app tab as the visible one', function() {
        expect(scope.visibleTab).toEqual('app');
    });

    it('should re-enable the buttons after starting', function() {
        expect(scope.starting).toBeUndefined();
	scope.startApp();
        expect(scope.starting).toEqual(false);
    });

    it('should re-enable the buttons after restarting', function() {
        expect(scope.restarting).toBeUndefined();
	scope.restartApp();
        expect(scope.restarting).toEqual(false);
    });

    it('should re-enable the buttons after stopping', function() {
        expect(scope.stopping).toBeUndefined();
	scope.stopApp();
        expect(scope.stopping).toEqual(false);
    });

});
