'use strict';

angular.module('sampleApplicationApp')
	.controller('LabelDeleteController', function($scope, $uibModalInstance, entity, Label) {

        $scope.label = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Label.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
