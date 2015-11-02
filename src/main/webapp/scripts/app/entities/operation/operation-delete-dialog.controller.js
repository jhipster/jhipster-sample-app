'use strict';

angular.module('sampleApplicationApp')
	.controller('OperationDeleteController', function($scope, $modalInstance, entity, Operation) {

        $scope.operation = entity;
        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Operation.delete({id: id},
                function () {
                    $modalInstance.close(true);
                });
        };

    });