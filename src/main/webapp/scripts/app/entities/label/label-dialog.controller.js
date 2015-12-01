'use strict';

angular.module('sampleApplicationApp').controller('LabelDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Label', 'Operation',
        function($scope, $stateParams, $uibModalInstance, entity, Label, Operation) {

        $scope.label = entity;
        $scope.operations = Operation.query();
        $scope.load = function(id) {
            Label.get({id : id}, function(result) {
                $scope.label = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('sampleApplicationApp:labelUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.label.id != null) {
                Label.update($scope.label, onSaveSuccess, onSaveError);
            } else {
                Label.save($scope.label, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
