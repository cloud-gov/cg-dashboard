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
                })
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
                })
                $cloudfoundry.getAuthStatus().then(function(status) {
                    expect(status).toEqual('unathorized');
                });
                httpBackend.flush();
            });
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

    describe('getOrgSpaceDetails', function() {

        it('should return space details with the org_name appended to the return array', function() {

            var single_org = {
                entity: {
                    name: 'org1',
                    spaces_url: '/v2/organization/123/spaces'
                }
            }
            httpBackend.whenGET(single_org.entity.spaces_url).respond({
                resources: ['mockspace1', 'mockspace2']
            });
            $cloudfoundry.getOrgSpaceDetails(single_org).then(function(data) {
                expect(data.org_name).toEqual('org1');
                expect(data.resources).toEqual(['mockspace1', 'mockspace2']);
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

    describe('getAllServices', function() {
        it('should return all the services the user has access to', function() {
            var services = {
                name: 'all',
                resources: [{
                    name: 'service1'
                }, {
                    name: 'service2'
                }]
            };
            httpBackend.whenGET('/v2/services').respond(services);
            $cloudfoundry.getAllServices().then(function(services) {
                expect(services.length).toEqual(2);
            });
        httpBackend.flush();
        });
    })

});
