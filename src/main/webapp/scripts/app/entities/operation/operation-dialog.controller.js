'use strict';

angular.module('sampleApplicationApp').controller('OperationDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Operation', 'BankAccount', 'Label',
        function($scope, $stateParams, $uibModalInstance, entity, Operation, BankAccount, Label) {

        $scope.operation = entity;
        $scope.bankaccounts = BankAccount.query();
        $scope.labels = Label.query();
        $scope.load = function(id) {
            Operation.get({id : id}, function(result) {
                $scope.operation = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('sampleApplicationApp:operationUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.operation.id != null) {
                Operation.update($scope.operation, onSaveSuccess, onSaveError);
            } else {
                Operation.save($scope.operation, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.datePickerForDate = {};

        $scope.datePickerForDate.status = {
            opened: false
        };

        $scope.datePickerForDateOpen = function($event) {
            $scope.datePickerForDate.status.opened = true;
        };
}]);
