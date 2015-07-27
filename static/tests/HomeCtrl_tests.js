describe('HomeCtrl function', function() {

    describe('HomeCtrl', function() {

        var $httpBackend, $rootScope, createController, authRequestHandler;

        beforeEach(module('cfconsole'));

        beforeEach(inject(function($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');
            // Set up mock endpoints
            authRequestHandler = $httpBackend
            authRequestHandler.when('GET', '/ping').respond({
                status: 'working'
            });
            $rootScope = $injector.get('$rootScope');
            var $controller = $injector.get('$controller');
            createController = function() {
                return $controller('HomeCtrl', {
                    '$scope': $rootScope
                });
            };
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });


        it('should expect a working backendStatus from /v2/authstatus and a title', function() {
            authRequestHandler.when('GET', '/v2/authstatus').respond({
                status: 'Welcome!'
            });
            $httpBackend.expectGET('/ping');
            var controller = createController();
            expect($rootScope.title).toBe("Cf-Console");
            expect($rootScope.backendStatus, "Welcome!");
            $httpBackend.flush();
        });


    })

});
