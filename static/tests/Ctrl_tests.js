// CF service method mocks
var getAuthStatus = function() {
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
};

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
                package_state: 'STAGED',
                services: [{
                    guid: 'serviceguid'
                }]
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

var getSpaceServices = function(spaceguid) {
    return {
        then: function(callback) {
            return callback([{
                metadata: {
                    guid: 'serviceguid'
                }
            }]);
        }
    }
};

var generalBindFunctions = function(service) {
    return {
        then: function(callback) {
            return callback({});
        }
    }
};

var getUserInfoGivenName = function() {
    return {
        then: function(callback) {
            return callback(
                'givenName1'
            )
        }
    }
};

var getServiceCredentials = function(service) {
    return {
        then: function(callback) {
            return callback({})
        }
    }
};

var createRoute = function(newRoute, appGuid) {
    if (newRoute.host === "usedHost") {
        return {
            then: function(callback) {
                return callback({status: 400, data: {description: 'error'}});
            }
        }
    };
    return {
        then: function(callback) {
            return callback({});
        }
    }
};


var deleteRoute = function(oldRoute) {
    return {
        then: function(callback) {
            return callback({})
        }
    }
};

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

describe('MainCtrl', function() {

    var scope, cloudfoundry, MenuData = {},
        uaa;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        // Mock cloudfoundry service
        cloudfoundry = {
            getOrgsData: getOrgsData,
            setOrgsData: setOrgsData
        };
        uaa = {
            getUserInfoGivenName: getUserInfoGivenName
        };
        //Load Ctrl and scope with mock service
        scope = $rootScope.$new();

        ctrl = $controller('MainCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            MenuData: MenuData,
            $uaa: uaa,
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

    it('should clear the menu data', function() {
        scope.MenuData.data = {
            test: 'data'
        }
        scope.clearDashboard();
        expect(scope.MenuData.data).toEqual({});
    });

    /*
    it('should place some given name to be displayed', function() {
        expect(scope.givenName).toEqual('givenName1');
    });
    */
});

describe('OrgCtrl', function() {
    var scope, cloudfoundry, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            findActiveOrg: findActiveOrg
        }
        spyOn(cloudfoundry, 'findActiveOrg');

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('OrgCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                orgguid: 'org1guid',
            },
            MenuData: MenuData
        });
    }));

    it('should return a space\'s summary info', function() {
        expect(cloudfoundry.findActiveOrg).toHaveBeenCalled();
    });
})

describe('SpaceCtrl', function() {

    var scope, cloudfoundry, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            getSpaceDetails: getSpaceDetails,
            findActiveOrg: findActiveOrg,
            getSpaceServices: getSpaceServices
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
            },
            MenuData: MenuData
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
        });
    });

    it('should render the app tab via the activeTab var when showTab function is run with "app"', function() {
        scope.showTab('app')
        expect(scope.activeTab).toEqual('app')
    });

    it('should render the services tab and service instances when showTab function is run with "serviceInstances"', function() {
        scope.showTab('serviceInstances')
        expect(scope.activeTab).toEqual('serviceInstances')
        expect(scope.services.length).toEqual(1)

    });


});

describe('MarketCtrl', function() {
    var scope, cloudfoundry, location, MenuData = {
        data: {}
    };
    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        //Mock CF service
        cloudfoundry = {
            getOrgServices: getOrgServices,
            findActiveOrg: findActiveOrg
        }
        spyOn(cloudfoundry, 'getOrgServices').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('MarketCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                orgguid: 'org1guid',
            },
            MenuData: MenuData,
            $location: location
        });
    }));

    it('should put all the services into the space', function() {
        expect(scope.services.length).toEqual(2);
    });

    it('should return the active org', function() {
        expect(scope.activeOrg.entity.name).toEqual('org1')
    });

});

describe('ServiceCtrl', function() {
    var scope, cloudfoundry, MenuData = {
        data: {}
    };
    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        //Mock CF service
        cloudfoundry = {
            getServiceDetails: getServiceDetails,
            getServicePlans: getServicePlans,
            findActiveOrg: findActiveOrg,
            createServiceInstance: createServiceInstance
        }

        spyOn(cloudfoundry, 'findActiveOrg').and.callThrough();
        spyOn(cloudfoundry, 'getServiceDetails').and.callThrough();
        spyOn(cloudfoundry, 'getServicePlans').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('ServiceCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            MenuData: MenuData
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

    it('should show the service maker when showServiceMaker invoked by passing spaces, activePlan, and show serviceMaker', function() {

        scope.showServiceMaker({
            name: 'plan1'
        });
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
        // TODO: add a spy to check on message
    });
});

describe('AppCtrl', function() {
    var scope, cloudfoundry, MenuData = {
        data: {}
    };
    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        //Mock CF service
        cloudfoundry = {
            stopApp: stopApp,
            startApp: startApp,
            restartApp: restartApp,
            getPollAppStatusProperty: getPollAppStatusProperty,
            getAppSummary: getAppSummary,
            getAppSummary: getAppSummary,
            getAppStats: getAppStats,
            findActiveOrg: findActiveOrg,
            getSpaceServices: getSpaceServices,
            bindService: generalBindFunctions,
            unbindService: generalBindFunctions,
            getServiceCredentials: getServiceCredentials,
            createRoute: createRoute,
            deleteRoute: deleteRoute
        };
        spyOn(cloudfoundry, 'getAppSummary').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('AppCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                appguid: 'appguid',
                spaceguid: 'spaceguid',
            },
            MenuData: MenuData
        });

    }));

    it('should will show error message if host or domain not present', function() {
        expect(scope.routeErrorMsg).toEqual(undefined);
        scope.createRoute({});
        expect(scope.routeErrorMsg).toEqual('Please provide both host and domain.');
        scope.createRoute({
            host: 'newhost'
        });
        expect(scope.routeErrorMsg).toEqual('Please provide both host and domain.');
        scope.createRoute({
            domain_guid: 'domain_guid'
        });
        expect(scope.routeErrorMsg).toEqual('Please provide both host and domain.');

    })

    it('should call the create route method and update the app while disabling the other route buttons', function() {
        expect(scope.blockRoutes).toEqual(undefined);
        scope.createRoute({
            host: 'host',
            domain_guid: 'domain_guid'
        });
        expect(scope.blockRoutes).toEqual(false);
        expect(scope.routeErrorMsg).toEqual(null);
        expect(cloudfoundry.getAppSummary).toHaveBeenCalledWith('appguid');
    })

    it('should return an error message if route exists', function() {
        expect(scope.blockRoutes).toEqual(undefined);
        scope.createRoute({
            host: 'usedHost',
            domain_guid: 'domain_guid'
        });
        expect(scope.routeErrorMsg).toEqual('error');
        expect(scope.blockRoutes).toEqual(false);
    })


    it('should call the delete route method and update the app while disabling the other route buttons', function() {
        expect(scope.blockRoutes).toEqual(undefined);
        scope.deleteRoute({});
        expect(scope.blockRoutes).toEqual(false);
        expect(cloudfoundry.getAppSummary).toHaveBeenCalledWith('appguid');
    })

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


    it('should put the available services into the app along with the boundService and credentials obj if it\'s bound', function() {

        expect(scope.availableServices).toEqual([{
            metadata: {
                guid: 'serviceguid'
            },
            boundService: {
                guid: 'serviceguid'
            },
            credentials: {}

        }]);
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

    it('should bind service when called', function() {
        spyOn(cloudfoundry, 'bindService').and.callThrough()
        scope.bindService({
            metadata: {
                guid: 'serviceguid'
            }
        });
        expect(cloudfoundry.bindService).toHaveBeenCalledWith({
            service_instance_guid: 'serviceguid',
            app_guid: 'appguid'
        })
    });

    it('should bind service when called', function() {
        spyOn(cloudfoundry, 'unbindService').and.callThrough()
        scope.unbindService({
            boundService: {
                guid: 'serviceguid2'
            }
        });
        expect(cloudfoundry.unbindService).toHaveBeenCalledWith({
            service_instance_guid: 'serviceguid2',
            app_guid: 'appguid'
        }, jasmine.any(Function))
    });

    it('should bind service when called and then refresh appSummary', function() {
        scope.unbindService({
            boundService: {
                guid: 'serviceguid2'
            }
        });
    });

});
