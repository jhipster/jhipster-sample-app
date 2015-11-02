'use strict';

angular.module('sampleApplicationApp')
	.controller('LabelDeleteController', function($scope, $modalInstance, entity, Label) {

        $scope.label = entity;
        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Label.delete({id: id},
                function () {
                    $modalInstance.close(true);
                });
        };

    });