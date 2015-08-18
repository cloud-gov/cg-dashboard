describe('CloudFoundry Service Tests', function() {

    var $cloudfoundry, httpBackend;

    beforeEach(module('cfdeck'));
    beforeEach(inject(function(_$cloudfoundry_, $httpBackend) {
        $cloudfoundry = _$cloudfoundry_;
        httpBackend = $httpBackend;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });


    describe('getAuthStatus', function() {

        describe('Authenticated', function() {

            it('should get the current auth status from the backend when authenticated', function() {
                httpBackend.whenGET('/v2/authstatus').respond({
                    status: 'authenticated'
                });
                $cloudfoundry.getAuthStatus().then(function(status) {
                    expect(status).toEqual('authenticated');
                });
                httpBackend.flush();
            });
        });

        describe('getAuthStatus: Forbidden', function() {

            it('should get the current auth status from the backend when not authenticated', function() {
                httpBackend.whenGET('/v2/authstatus').respond(401, {
                    'status': 'unathorized'
                });
                $cloudfoundry.getAuthStatus().then(function(status) {
                    expect(status).toEqual('unathorized');
                });
                httpBackend.flush();
            });
        });
    });

    describe('isAuthorized', function() {
        it('should return true if authenticated', function() {
            httpBackend.whenGET('/v2/authstatus').respond({
                status: 'authorized'
            });
            $cloudfoundry.isAuthorized().then(function(status) {
                expect(status).toEqual(true);
            })
            httpBackend.flush();
        });
    });


    describe('getOrgs', function() {
        it('should return false if not authenticated', function() {
            httpBackend.whenGET('/v2/authstatus').respond({
                status: 'unauthorized'
            });
            $cloudfoundry.isAuthorized().then(function(status) {
                expect(status).toEqual(false);
            })
            httpBackend.flush();
        });

    });

    describe('deleteRoute', function() {
        it('should delete the route and return the data', function() {
            httpBackend.whenDELETE('/v2/routes/routeguid').respond({
                status: 'deleted'
            });
            $cloudfoundry.deleteRoute({
                    guid: 'routeguid'
                })
                .then(function(response) {
                    expect(response.status).toEqual('deleted');
                });
            httpBackend.flush();
        });
    });

    describe('createRoute', function() {
        it('should create a route and then map it to the app', function() {
            var newRoute = {
                domain_guid: 'domainguid',
                host: 'host'
            };
            httpBackend.whenPOST('/v2/routes', newRoute).respond({
                metadata: {
                    url: '/v2/routes/routeguid'
                }
            })
            httpBackend.whenPUT('/v2/routes/routeguid/apps/appguid').respond({
                status: 'put'
            });
            $cloudfoundry.createRoute(newRoute, 'appguid').then(function(response) {
                expect(response).toEqual({
                    status: 'put'
                });
            });
            httpBackend.flush();
        });

        it('should return a message on failure of first call', function() {
            var newRoute = {
                domain_guid: 'domainguid',
                host: 'host'
            };
            httpBackend.whenPOST('/v2/routes', newRoute).respond(400, {
                status: 'failed'
            });
            $cloudfoundry.createRoute(newRoute, 'appguid').then(function(response) {
                expect(response).toEqual({
                    status: 'failed'
                });
            });
            httpBackend.flush();
        });
   
        it('should return a message on failure of second call', function() {
            var newRoute = {
                domain_guid: 'domainguid',
                host: 'host'
            };
            httpBackend.whenPOST('/v2/routes', newRoute).respond({
                metadata: {
                    url: '/v2/routes/routeguid'
                }
            })
            httpBackend.whenPUT('/v2/routes/routeguid/apps/appguid').respond(400, {
                status: 'put_failed'
            });
            $cloudfoundry.createRoute(newRoute, 'appguid').then(function(response) {
                expect(response).toEqual({
                    status: 'put_failed'
                });
            });
            httpBackend.flush();
        });
    });

    describe('getOrgs', function() {
        it('should return only the organizations\' array from the /v2/organization endpoint', function() {
            httpBackend.whenGET('/v2/organizations').respond({
                pages: 1,
                resources: [{
                    name: 'org1'
                }, {
                    name: 'org2'
                }]
            });
            $cloudfoundry.getOrgs().then(function(orgs) {
                expect(orgs).toEqual(
                    [{
                        name: 'org1'
                    }, {
                        name: 'org2'
                    }])
            });
            httpBackend.flush();
        });

        it('should return user to home page if call fails', function() {

            httpBackend.whenGET('/v2/organizations').respond(401, {
                'status': 'unathorized'
            });
            $cloudfoundry.getOrgs().then(function(orgs) {
                expect(orgs).toEqual({
                    status: 'unauthorized'
                });
            });
            httpBackend.flush();
        });

    });

    describe('getOrgDetails', function() {

        it('should return summary data for a specific org', function() {
            var orgSummary = {
                name: 'sandbox',
                spaces: [{
                    name: 'space1'
                }, {
                    name: 'space2'
                }]
            };
            httpBackend.whenGET('/v2/organizations/mockguid/summary').respond(orgSummary);
            $cloudfoundry.getOrgDetails('mockguid').then(function(data) {
                expect(data.name).toEqual('sandbox');
                expect(data.spaces.length).toEqual(2);
            });
            httpBackend.flush();
        });

    });

    describe('getOrgDetails', function() {
        
        var org = {guid: 'orgguid'}
    
        it('should make multiple calls to get org info', function() {
            httpBackend.whenGET('/v2/organizations/orgguid/memory_usage').respond({memory_usage_in_mb: 99});
            httpBackend.whenGET('/v2/organizations/orgguid').respond({entity: {quota_definition_url: '/quota_definition_url'}});
            httpBackend.whenGET('/quota_definition_url').respond({entity: {memory_limit: 99}});
            $cloudfoundry.getQuotaUsage(org)
            httpBackend.flush();
            expect(org.quota).toEqual({ memory_limit: 99, used_memory: 99 });
        });    
    });


    describe('getOrgsData', function() {

        it('should return org data when `orgs` is undefined', function() {

            // Setting up mock response
            httpBackend.whenGET('/v2/organizations').respond({
                pages: 1,
                resources: [{
                    name: 'org1'
                }, {
                    name: 'org2'
                }]
            });

            var callbackSpy = function(data) {
                expect(data.length).toEqual(2);
                describe('When new data is inserted into the $cloudfoundry ctrl', function() {
                    data.push({
                        name: 'spyOrg'
                    });
                    $cloudfoundry.setOrgsData(data);
                    $cloudfoundry.getOrgsData(function(storedData) {
                        expect(storedData.length).toEqual(3);
                    });
                });
            }
            $cloudfoundry.getOrgsData(callbackSpy);
            httpBackend.flush();

        });
    });

    describe('getSpaceDetails', function() {

        it('should return space details when given a spaceGuid', function() {
            var spaceSummary = {
                name: 'spacename',
                apps: [{
                    name: 'app1'
                }, {
                    name: 'app2'
                }]
            };
            httpBackend.whenGET('/v2/spaces/spaceguid/summary').respond(spaceSummary);
            $cloudfoundry.getSpaceDetails('spaceguid').then(function(data) {
                expect(data.name).toEqual('spacename');
                expect(data.apps.length).toEqual(2);
            });
            httpBackend.flush();
        });
    });

    describe('getOrgServices', function() {
        it('should return all the services the user has access to', function() {
            var services = {
                name: 'all',
                resources: [{
                    name: 'service1'
                }, {
                    name: 'service2'
                }]
            };
            httpBackend.whenGET('/v2/organizations/testorgguid/services').respond(services);
            $cloudfoundry.getOrgServices('testorgguid').then(function(services) {
                expect(services.length).toEqual(2);
            });
            httpBackend.flush();
        });
    });

    describe('getSpaceServices', function() {
        it('should return all the service instances avaiable to the space apps', function() {
            httpBackend.whenGET('/v2/spaces/spaceguid/service_instances').respond({
                page: 1,
                resources: [{
                    name: 'fakename'
                }]
            });

            $cloudfoundry.getSpaceServices('spaceguid').then(function(data) {
                expect(data).toEqual([{
                    name: 'fakename'
                }]);
            });
            httpBackend.flush();

        });
    });

    describe('bindService', function() {
        it('should send a post request to bind app and return a success message', function() {
            httpBackend.whenPOST('/v2/service_bindings', {}).respond({
                guid: 'newbindingguid'
            });

            $cloudfoundry.bindService({}).then(function(response) {
                expect(response.data.guid).toEqual('newbindingguid');
            });
            httpBackend.flush();

        });

        it('should send a post request to bind app and if the binding fails it should return a failure message', function() {
            httpBackend.whenPOST('/v2/service_bindings', {}).respond(400, {
                message: 'error'
            });

            $cloudfoundry.bindService({}).then(function(response) {
                expect(response.data.message).toEqual('error');
            });
            httpBackend.flush();

        });

    });

    describe('unbindService', function() {
        it('should find the correct service binding instance and then unbind it', function() {
            httpBackend.whenGET('/v2/apps/appguid/service_bindings')
                .respond({
                    resources: [{
                        entity: {
                            service_instance_guid: 'serviceInstanceGuid'
                        },
                        metadata: {
                            url: '/v2/bindingurl'
                        }
                    }]
                });
            httpBackend.whenDELETE('/v2/bindingurl').respond(201, {
                succeeded: true
            });
            var data = {
                app_guid: 'appguid',
                service_instance_guid: 'serviceInstanceGuid'
            }
            var callbackSpy = function(response) {
                expect(response.status).toEqual(201);
            };
            $cloudfoundry.unbindService(data, callbackSpy)
            httpBackend.flush();

        });
    });

    describe('getServiceCredentials', function() {
        it('it should return service credentials for a bound app by searching through and finding the instances that matches', function() {
            httpBackend.whenGET('/v2/services_instances/serviceguid/service_bindings')
                .respond({
                    resources: [{
                        entity: {
                            space_guid: 'spaceguid2',
                            credentials: {}
                        }
                    }, {
                        entity: {
                            space_guid: 'spaceguid1',
                            credentials: {
                                secret: 'a'
                            }
                        }
                    }]
                })
            var service = {
                entity: {
                    service_bindings_url: '/v2/services_instances/serviceguid/service_bindings'
                },
                space_guid: 'spaceguid1'
            }
            $cloudfoundry.getServiceCredentials(service)
                .then(function(data) {
                    expect(data).toEqual({
                        secret: 'a'
                    })
                });
            httpBackend.flush();
        })

    })

    describe('getServiceDetails', function() {
        it('should collect a specific service\'s details', function() {

            httpBackend.whenGET('/v2/services/serviceguid').respond({});
            $cloudfoundry.getServiceDetails('serviceguid')
            httpBackend.flush();
        });
    });

    describe('getServicePlans', function() {
        it('should collect a specific service\'s plans but not break when there are no plans', function() {

            httpBackend.whenGET('/v2/services/serviceguid/service_plans').respond({
                resources: []
            });
            $cloudfoundry.getServicePlans('/v2/services/serviceguid/service_plans').then(function(data) {
                expect(data).toEqual([]);
            });
            httpBackend.flush();
        });
        it('should collect a specific service\'s plans and not break when there is no extra', function() {

            httpBackend.whenGET('/v2/services/serviceguid/service_plans').respond({
                resources: [{
                    entity: 'other data'
                }]
            });
            $cloudfoundry.getServicePlans('/v2/services/serviceguid/service_plans').then(function(data) {
                expect(data).toEqual([{
                    entity: 'other data'
                }]);
            });
            httpBackend.flush();
        });
        it('should collect a specific service\'s plans and covert extra to json', function() {

            httpBackend.whenGET('/v2/services/serviceguid/service_plans').respond({
                resources: [{
                    entity: {
                        extra: '{"costs": 1}'
                    }
                }]
            });
            $cloudfoundry.getServicePlans('/v2/services/serviceguid/service_plans').then(function(data) {
                expect(data[0].entity.extra).toEqual({
                    costs: 1
                });
            });
            httpBackend.flush();
        });
    });

    describe('createServiceInstance', function() {
        it('should great a service instance via post request', function() {
            var created = {
                space_url: '/v2/spaces/123'
            };
            httpBackend.whenPOST('/v2/service_instances?accepts_incomplete=true', {
                data: 'test'
            }).respond(created);
            $cloudfoundry.createServiceInstance({
                data: 'test'
            }).then(function(response) {
                expect(response.data.space_url).toEqual('/v2/spaces/123');
            });
            httpBackend.flush();
        });

        it('should return an error message when creation fails', function() {
            var created = {
                description: 'Duplicate Name'
            };
            httpBackend.whenPOST('/v2/service_instances?accepts_incomplete=true', {
                data: 'test'
            }).respond(400, created);
            $cloudfoundry.createServiceInstance({
                data: 'test'
            }).then(function(response) {
                expect(response.data.description).toEqual('Duplicate Name');
            });
            httpBackend.flush();
        });
    });

    // TODO test directive controller functions
    describe('deleteServiceInstance', function() {
        it('should delete a service instance via a delete request', function() {
            httpBackend.whenDELETE('/v2/service_instance/serviceguid').respond({
                message: 'deleted'
            })
            $cloudfoundry.deleteServiceInstance({
                metadata: {
                    url: '/v2/service_instance/serviceguid'
                }
            }, false).then(function(response) {
                expect(response).toEqual({
                    message: 'deleted'
                });
            });
            httpBackend.flush();

        });

        it('should pass on errors', function() {
            httpBackend.whenDELETE('/v2/service_instance/serviceguid').respond(400, {
                message: 'service in use'
            })
            $cloudfoundry.deleteServiceInstance({
                metadata: {
                    url: '/v2/service_instance/serviceguid'
                }
            }, false).then(function(response) {
                expect(response).toEqual({
                    message: 'service in use'
                });
            });
            httpBackend.flush();
        });

        it('should delete all bound instances when the bound parameter is true', function() {
            httpBackend.whenDELETE('/v2/service_instance/serviceguid').respond({
                    message: 'service instance deleted'
                })
                // These two requests should be flushed when call is finished
            httpBackend.whenDELETE('/v2/bindingurl1').respond({
                message: 'deleted'
            })
            httpBackend.whenDELETE('/v2/bindingurl2').respond({
                message: 'deleted'
            })
            httpBackend.whenGET('/v2/service_instance/serviceguid/bound_instances').respond({
                resources: [{
                    metadata: {
                        url: '/v2/bindingurl1'
                    }
                }, {
                    metadata: {
                        url: '/v2/bindingurl2'
                    }
                }]
            })
            $cloudfoundry.deleteServiceInstance({
                metadata: {
                    url: '/v2/service_instance/serviceguid'
                },
                entity: {
                    service_bindings_url: '/v2/service_instance/serviceguid/bound_instances'
                }
            }, true).then(function(response) {
                expect(response).toEqual({
                    message: 'service instance deleted'
                });
            });
            httpBackend.flush();
        });


    });

    describe('getAppSummary', function() {
        it('should return summary data for a specific app', function() {
            var appSummary = {
                name: 'sampleapp',
                guid: 'appguid',
                memory: 1024,
                disk_quota: 1024,
                instances: 1
            };
            httpBackend.whenGET('/v2/apps/appguid/summary').respond(appSummary);
            $cloudfoundry.getAppSummary('appguid').then(function(data) {
                expect(data.name).toEqual('sampleapp');
                expect(data.guid).toEqual('appguid');
                expect(data.instances).toEqual(1);
                expect(data.memory).toEqual(1024);
                expect(data.disk_quota).toEqual(1024);
            });
            httpBackend.flush();
        });
    });

    describe('findActiveOrg', function() {
        it('should find the active org given an org guid', function() {
            // Setting up mock response
            httpBackend.whenGET('/v2/organizations/org1/summary').respond({
                guid: 'org1'
            });

            // Callback spy to check if the method can get the org when the org data exists
            var getActiveOrgSpyExists = function(org) {
                    expect(org.guid).toEqual('org1');
                }
                // Now that orgs have been set check if the function can find another org
                // Callback spy to check if the method can get the org when the org data isn't there
            var getActiveOrgSpyNew = function(org) {
                expect(org.guid).toEqual('org1');
                // Now that orgs have been set check if the function can find another org
                $cloudfoundry.findActiveOrg('org1', getActiveOrgSpyExists);
            };
            $cloudfoundry.findActiveOrg('org1', getActiveOrgSpyNew);
            httpBackend.flush();
        });
    });

    describe('getAppStats', function() {
        it('should return detailed data for a specific STARTED app', function() {
            var appStats = [{
                name: 'sampleapp',
                guid: 'appguid',
                stats: {
                    usage: {
                        disk: 66392064
                    }
                }
            }];
            httpBackend.whenGET('/v2/apps/appguid/stats').respond(appStats);
            $cloudfoundry.getAppStats('appguid').then(function(data) {
                expect(data[0].name).toEqual('sampleapp');
                expect(data[0].guid).toEqual('appguid');
                expect(data[0].stats.usage.disk).toEqual(66392064);
            });
            httpBackend.flush();
        });
    });

    describe('startApp', function() {
        it('should send a request to start an app', function() {
            var app = {}
            app.state = "STOPPED";
            app.guid = "appguid";
            spyOn($cloudfoundry, 'changeAppState');
            $cloudfoundry.startApp(app);
            expect($cloudfoundry.changeAppState).toHaveBeenCalledWith(app, "STARTED");
        });
    });

    describe('stopApp', function() {
        it('should send a request to stop an app', function() {
            var app = {}
            app.state = "STARTED";
            app.guid = "appguid";
            spyOn($cloudfoundry, 'changeAppState');
            $cloudfoundry.stopApp(app);
            expect($cloudfoundry.changeAppState).toHaveBeenCalledWith(app, "STOPPED");
        });
    });

    describe('changeAppState', function() {
        it('should send a request to change the state of an app and change the app object state if successful', function() {
            var app = {}
            app.state = "STARTED";
            app.guid = "appguid";
            httpBackend.whenPUT('/v2/apps/' + app.guid + '?async=false&inline-relations-depth=1').respond({});
            $cloudfoundry.changeAppState(app, "STOPPED").then(function() {
                expect(app.state).toEqual("STOPPED");
            });
            httpBackend.flush();
        });

        it('should send a request to change the state of an app and NOT change the app object state if it fails', function() {
            var app = {}
            app.state = "STARTED";
            app.guid = "appguid";
            httpBackend.whenPUT('/v2/apps/' + app.guid + '?async=false&inline-relations-depth=1').respond(401, {});
            $cloudfoundry.changeAppState(app, "STOPPED").then(function() {
                expect(app.state).toEqual("STARTED");
            });
            httpBackend.flush();
        });
    });

});
