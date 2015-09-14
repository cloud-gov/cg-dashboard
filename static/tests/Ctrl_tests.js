// CF service method mocks
var getAuthStatus = function() {
    return {
        then: function(callback) {
            return callback('authenticated');
        }
    }
};

var isAuthorized = function() {
    return {
        then: function(callback) {
            return callback(true);
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

var setOrgsData = function(org) {
    org.quota = {}
};

var setOrgUserCategory = function(orgGuid, userGuid, category, adding) {
    return {
        then: function(callback) {
            return callback();
        }
    }
};

var getOrgUserCategory = function(orgGuid, userGuid, category, queryString) {
    return {
        then: function(callback) {
            return callback([{
                metadata: {
                    guid: 'guiduser1'
                },
                entity: {
                    username: 'user1',
                    admin: false,
                }
            }])
        }
    }
};

var getUserInfoGuid = function() {
    return {
        then: function(callback) {
            return callback({
                user: {
                    id: 'guid'
                }
            })
        }
    }
};

var findUserPermissions = function() {
    return {
        then: function(callback) {
            return callback();
        }
    }
}

var getUserGuidFromUserName = function(user) {
    user.id = 'guid';
    return {
        then: function(callback) {}
    }
};

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

var findActiveSpace = function(spaceguid, callback) {
    callback({
        guid: 'spaceguid',
        name: 'spacename',
        apps: [{
            name: 'mockname1'
        }, {
            name: 'mockname2'
        }]
    });
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

var getAppEvents = function(appGuid) {
    return {
        then: function(callback) {
            return callback([{
                entity: {
                    timestamp: '0',
                    metadata: {
                        request: 'request'
                    }
                }
            }])
        }
    }
};

var getAppLogs = function(appGuid) {
    return {
        then: function(callback) {
            return callback([{
                message: 'message0'
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
                return callback({
                    status: 400,
                    data: {
                        description: 'error'
                    }
                });
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

var getQuotaUsage = function(org) {
    //org.quota = 'data';
};

var getOrgUsersGeneric = function(guid, org_users, load) {
    org_users = [{
        metadata: {
            guid: 'guiduser1'
        },
        entity: {
            username: 'user1',
            admin: false,
        }
    }]
    load = {
        status: 'complete'
    }
}

var returnHome = function() {
    return;
}

var getUsersGeneric = function(guid) {
    return {
        then: function(callback) {
            return callback(
                [{
                    metadata: {
                        guid: 'user1'
                    },
                    entity: {
                        space_roles: ['space_auditor']
                    }
                }]
            )
        }
    }
};

describe('MainCtrl', function() {

    var scope, cloudfoundry, MenuData = {},
        uaa;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {
        // Mock cloudfoundry service
        cloudfoundry = {
            getOrgsData: getOrgsData,
            setOrgsData: setOrgsData,
            returnHome: returnHome,
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

    it('should clear the menu data', function() {
        scope.MenuData = {};
        scope.MenuData.data = {
            test: 'data'
        };
        scope.clearDashboard();
        expect(scope.MenuData.data).toEqual({});
    });

});

describe('OrgCtrl', function() {
    var scope, cloudfoundry, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            findActiveOrg: findActiveOrg,
            getOrgUserCategory: getOrgUserCategory,
            getQuotaUsage: getQuotaUsage,
            returnHome: returnHome,
            isAuthorized: isAuthorized            
        }
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions
        };
        spyOn(cloudfoundry, 'findActiveOrg').and.callThrough();
        spyOn(cloudfoundry, 'getQuotaUsage');

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('OrgCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                orgguid: 'org1guid',
            },
            $uaa: uaa,
            MenuData: MenuData
        });
    }));

    it('should return a space\'s summary info and get quota info', function() {
        expect(cloudfoundry.findActiveOrg).toHaveBeenCalled();
        expect(cloudfoundry.getQuotaUsage).toHaveBeenCalledWith({
            entity: {
                name: 'org1'
            }
        });
    });
})

describe('OrgManagementCtrl', function() {

    var scope, cloudfoundry, uaa, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            setOrgUserCategory: setOrgUserCategory,
            getOrgUserCategory: getOrgUserCategory,
            getOrgUsers: getOrgUsersGeneric,
            findActiveOrg: findActiveOrg,
            getQuotaUsage: getQuotaUsage,
            returnHome: returnHome,
            isAuthorized: isAuthorized            
        }

        // Spyon
        spyOn(cloudfoundry, 'getOrgUsers').and.callThrough();

        // Mock UAA service
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            getUserGuidFromUserName: getUserGuidFromUserName,
            findUserPermissions: findUserPermissions

        };

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('OrgManagementCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $uaa: uaa,
            $routeParams: {
                orgguid: 'org1guid',
            },
            MenuData: MenuData
        });
    }));

    it('should call the get orgUsers method with correct arguments', function() {
        expect(cloudfoundry.getOrgUsers).toHaveBeenCalledWith('org1guid', [], {
            status: false
        });
    });

    it('should render the current Org Users tab via the activeTab var on load', function() {
        expect(scope.activeTab).toEqual('current_org_users')
    });

});

describe('OrgUserManagementCtrl', function() {

    var scope, cloudfoundry, uaa, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            setOrgUserCategory: setOrgUserCategory,
            getOrgUserCategory: getOrgUserCategory,
            getOrgUsers: getOrgUsersGeneric,
            findActiveOrg: findActiveOrg,
            getOrgUserCategory: getOrgUserCategory,
            getQuotaUsage: getQuotaUsage,
            returnHome: returnHome,
            isAuthorized: isAuthorized         
        }
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions
        };


        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('OrgUserManagementCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $uaa: uaa,
            $routeParams: {
                orgguid: 'org1guid',
                userguid: 'user1guid',
            },
            $uaa: uaa,
            MenuData: MenuData
        });
    }));

    it('should initialize all the correct values to the user\'s roles', function() {
        expect(scope.initOrgManagerState).toEqual(true);
        expect(scope.initBillingManagerState).toEqual(true);
        expect(scope.initOrgAuditorState).toEqual(true);
    });

    it('should send a new value if different from previous', function() {
        scope.$digest();
        spyOn(cloudfoundry, 'setOrgUserCategory').and.callThrough();
        expect(scope.initOrgManagerState).toEqual(true);
        expect(scope.orgManagerStatus).toEqual(false);
        expect(scope.orgManagerStateChanging).toEqual(undefined);
        scope.orgManagerStatus = true;
        scope.$digest();
        expect(cloudfoundry.setOrgUserCategory).toHaveBeenCalled();
        expect(scope.orgManagerStatus).toEqual(true);
        expect(scope.orgManagerStateChanging).toEqual(false);

        scope.$digest();
        expect(scope.initBillingManagerState).toEqual(true);
        expect(scope.billingManagerStatus).toEqual(false);
        expect(scope.billingManagerStateChanging).toEqual(undefined);
        scope.billingManagerStatus = true;
        scope.$digest();
        expect(cloudfoundry.setOrgUserCategory).toHaveBeenCalled();
        expect(scope.billingManagerStatus).toEqual(true);
        expect(scope.billingManagerStateChanging).toEqual(false);

        scope.$digest();
        expect(scope.initOrgAuditorState).toEqual(true);
        expect(scope.orgAuditorStateChanging).toEqual(undefined);
        expect(scope.orgAuditorStatus).toEqual(false);
        scope.orgAuditorStatus = true;
        scope.$digest();
        expect(cloudfoundry.setOrgUserCategory).toHaveBeenCalled();
        expect(scope.orgAuditorStatus).toEqual(true);
        expect(scope.orgAuditorStateChanging).toEqual(false);
    });
});

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
            getSpaceServices: getSpaceServices,
            getQuotaUsage: getQuotaUsage,
            getOrgUserCategory: getOrgUserCategory,
            findActiveSpace: findActiveSpace,
            returnHome: returnHome,
            isAuthorized: isAuthorized
        }
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions

        };

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
            $uaa: uaa,
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

    it('should render the app tab via the activeTab var on load', function() {
        expect(scope.activeTab).toEqual('apps')
    });

});


describe('SpaceServicesCtrl', function() {

    var scope, cloudfoundry, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            getSpaceDetails: getSpaceDetails,
            findActiveOrg: findActiveOrg,
            getQuotaUsage: getQuotaUsage,
            getSpaceServices: getSpaceServices,
            getOrgUserCategory: getOrgUserCategory,
            findActiveSpace: findActiveSpace,
            returnHome: returnHome,
            isAuthorized: isAuthorized
        }
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions

        };

        spyOn(cloudfoundry, 'getSpaceDetails').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('SpaceServicesCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                orgguid: 'org1guid',
                spaceguid: 'spaceguid'
            },
            $uaa: uaa,
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

    it('should render the app tab via the activeTab var on load along with the services', function() {
        expect(scope.activeTab).toEqual('services');
        expect(scope.services).toEqual([{
            metadata: {
                guid: 'serviceguid'
            }
        }]);
    });

});


describe('SpaceUserCtrl', function() {

    var scope, cloudfoundry, MenuData = {
        data: {}
    };

    beforeEach(module('cfdeck'));
    beforeEach(inject(function($rootScope, $controller) {

        //Mock Cf service
        cloudfoundry = {
            getSpaceDetails: getSpaceDetails,
            findActiveOrg: findActiveOrg,
            getQuotaUsage: getQuotaUsage,
            getSpaceUsers: getUsersGeneric,
            getOrgUsers: getUsersGeneric,
            findActiveSpace: findActiveSpace,
            getOrgUserCategory: getOrgUserCategory,
            returnHome: returnHome,
            isAuthorized: isAuthorized,            
            toggleSpaceUserPermissions: function(user, permission, spaceGuid) {
                return {
                    then: function(callback) {
                        if (permission === 'managers') {
                            user[permission] = false;
                            return callback({
                                status: 201
                            });
                        } else {
                            return callback({
                                status: 400,
                                data: {
                                    description: 'error'
                                }
                            });
                        }
                    }
                }
            }
        };
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions
        };

        spyOn(cloudfoundry, 'getSpaceDetails').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new();
        ctrl = $controller('SpaceUserCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $routeParams: {
                orgguid: 'org1guid',
                spaceguid: 'spaceguid'
            },
            $uaa: uaa,
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

    it('should render the app tab via the activeTab var on load along with the services', function() {
        expect(scope.activeTab).toEqual('users');
    });

    it('it should remove the active user', function() {
        scope.activeUser = 'user';
        expect(scope.activeUser).toBe('user')
        scope.unsetActiveUser()
        expect(scope.activeUser).toBe(null)
    });

    it('should check if a org user is in the space user object and return thier roles', function() {
        // Test user that does exist in org, this user was set in a space for this ctrl.
        expect(scope.disableSwitches).toBe(undefined);
        var user = {
            metadata: {
                guid: 'user1'
            }
        };
        scope.setActiveUser(user);
        expect(scope.activeUser.metadata.guid).toBe('user1');
        expect(scope.activeUser.managers).toBe(false);
        expect(scope.activeUser.auditors).toBe(true);
        expect(scope.activeUser.developers).toBe(false);
        expect(scope.disableSwitches).toBe(false);
        // Test user that does not exist in org
        var user = {
            metadata: {
                guid: 'user2'
            }
        };
        scope.setActiveUser(user);
        expect(scope.activeUser.metadata.guid).toBe('user2');
        expect(scope.activeUser.managers).toBe(false);
        expect(scope.activeUser.auditors).toBe(false);
        expect(scope.activeUser.developers).toBe(false);
    });

    it('should allow a space manager to toggle the space user permissions', function() {
        // Space manager setting permissions
        scope.activeUser = {
            managers: true,
            auditors: true
        };
        expect(scope.disableSwitches).toBe(undefined);
        // Flip the user manager permission to false
        scope.activeUser.managers = false;
        scope.toggleSpaceUserPermissions('managers');
        expect(scope.activeUser.managers).toBe(false);
        expect(scope.disableSwitches).toBe(false);

        // Space if the permission setting fails
        // Flip the user manager permission to false
        scope.activeUser.auditors = false;
        scope.toggleSpaceUserPermissions('auditors');
        // The method will reject the switch and return the permissions to the original state
        expect(scope.activeUser.auditors).toBe(true);
        // Show error message
        expect(scope.spaceUserError).toBe('error');
    })

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
            findActiveOrg: findActiveOrg,
            getOrgUserCategory: getOrgUserCategory,
            getQuotaUsage: getQuotaUsage,
            returnHome: returnHome,
            isAuthorized: isAuthorized,       
        }
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions
        };
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
            $uaa: uaa,
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
            createServiceInstance: createServiceInstance,
            getOrgUserCategory: getOrgUserCategory,
            getQuotaUsage: getQuotaUsage,
            returnHome: returnHome,
            isAuthorized: isAuthorized,                    
        }
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions

        };

        spyOn(cloudfoundry, 'findActiveOrg').and.callThrough();
        spyOn(cloudfoundry, 'getServiceDetails').and.callThrough();
        spyOn(cloudfoundry, 'getServicePlans').and.callThrough();

        // Load Ctrl and scope
        scope = $rootScope.$new()
        ctrl = $controller('ServiceCtrl', {
            $scope: scope,
            $cloudfoundry: cloudfoundry,
            $uaa: uaa,
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
            getAppStats: getAppStats,
            getAppEvents: getAppEvents,
            getAppLogs: getAppLogs,
            getSpaceDetails: getSpaceDetails,
            findActiveOrg: findActiveOrg,
            getSpaceServices: getSpaceServices,
            bindService: generalBindFunctions,
            unbindService: generalBindFunctions,
            getServiceCredentials: getServiceCredentials,
            createRoute: createRoute,
            deleteRoute: deleteRoute,
            getQuotaUsage: getQuotaUsage,
            getOrgUserCategory: getOrgUserCategory,
            findActiveSpace: getSpaceDetails,
            returnHome: returnHome,
            isAuthorized: isAuthorized,           
        };
        uaa = {
            getUserInfoGuid: getUserInfoGuid,
            findUserPermissions: findUserPermissions

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
            $uaa: uaa,
            MenuData: MenuData
        });

    }));


    it('should call the create route method and update the app while disabling the other route buttons', function() {
        expect(scope.blockRoutes).toEqual(undefined);
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
