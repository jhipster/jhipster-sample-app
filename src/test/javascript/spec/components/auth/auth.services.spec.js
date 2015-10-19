'use strict';

describe('Services Tests ', function () {

    describe('Auth', function () {
        var $httpBackend, spiedLocalStorageService, authService, spiedAuthServerProvider;

        beforeEach(inject(function($injector, localStorageService, Auth, AuthServerProvider) {
            $httpBackend = $injector.get('$httpBackend');
            spiedLocalStorageService = localStorageService;
            authService = Auth;
            spiedAuthServerProvider = AuthServerProvider;
            //Request on app init
            $httpBackend.whenGET(/api\/account\?cacheBuster=\d+/).respond({});
            $httpBackend.whenGET('scripts/app/main/main.html').respond({});
            $httpBackend.whenGET('scripts/components/navbar/navbar.html').respond({});
            var globalJson = new RegExp('i18n\/.*\/global.json')
            var mainJson = new RegExp('i18n\/.*\/main.json');
            $httpBackend.whenGET(globalJson).respond({});
            $httpBackend.whenGET(mainJson).respond({});
            $httpBackend.expectPOST(/api\/logout\?cacheBuster=\d+/).respond(200, '');
          }));
        //make sure no expectations were missed in your tests.
        //(e.g. expectGET or expectPOST)
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should call backend on logout then call authServerProvider.logout', function(){
            //GIVEN
            //Set spy
            spyOn(spiedAuthServerProvider, 'logout').and.callThrough();
            spyOn(spiedLocalStorageService, "clearAll").and.callThrough();

            //WHEN
            authService.logout();
            //flush the backend to "execute" the request to do the expectedGET assertion.
            $httpBackend.flush();

            //THEN
            expect(spiedAuthServerProvider.logout).toHaveBeenCalled();
            expect(spiedLocalStorageService.clearAll).toHaveBeenCalled();
        });

    });
});
