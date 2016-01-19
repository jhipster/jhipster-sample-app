'use strict';

describe('Controller Tests', function() {

    describe('Operation Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockOperation, MockBankAccount, MockLabel;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockOperation = jasmine.createSpy('MockOperation');
            MockBankAccount = jasmine.createSpy('MockBankAccount');
            MockLabel = jasmine.createSpy('MockLabel');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Operation': MockOperation,
                'BankAccount': MockBankAccount,
                'Label': MockLabel
            };
            createController = function() {
                $injector.get('$controller')("OperationDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'sampleapplicationApp:operationUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
