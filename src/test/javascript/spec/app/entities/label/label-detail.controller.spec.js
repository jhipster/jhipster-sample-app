'use strict';

describe('Label Detail Controller', function() {
    var $scope, $rootScope;
    var MockEntity, MockLabel, MockOperation;
    var createController;

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        MockEntity = jasmine.createSpy('MockEntity');
        MockLabel = jasmine.createSpy('MockLabel');
        MockOperation = jasmine.createSpy('MockOperation');
        

        var locals = {
            '$scope': $scope,
            '$rootScope': $rootScope,
            'entity': MockEntity ,
            'Label': MockLabel,
            'Operation': MockOperation
        };
        createController = function() {
            $injector.get('$controller')("LabelDetailController", locals);
        };
    }));


    describe('Root Scope Listening', function() {
        it('Unregisters root scope listener upon scope destruction', function() {
            var eventType = 'sampleApplicationApp:labelUpdate';

            createController();
            expect($rootScope.$$listenerCount[eventType]).toEqual(1);

            $scope.$destroy();
            expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
        });
    });
});
