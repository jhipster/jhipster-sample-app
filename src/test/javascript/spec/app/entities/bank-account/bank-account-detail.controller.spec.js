'use strict';

describe('Controller Tests', function() {

    describe('BankAccount Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockBankAccount, MockUser, MockOperation;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockBankAccount = jasmine.createSpy('MockBankAccount');
            MockUser = jasmine.createSpy('MockUser');
            MockOperation = jasmine.createSpy('MockOperation');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'BankAccount': MockBankAccount,
                'User': MockUser,
                'Operation': MockOperation
            };
            createController = function() {
                $injector.get('$controller')("BankAccountDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'sampleApplicationApp:bankAccountUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
