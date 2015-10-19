'use strict';

angular.module('sampleApplicationApp').controller('OperationDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Operation', 'BankAccount', 'Label',
        function($scope, $stateParams, $modalInstance, entity, Operation, BankAccount, Label) {

        $scope.operation = entity;
        $scope.bankaccounts = BankAccount.query();
        $scope.labels = Label.query();
        $scope.load = function(id) {
            Operation.get({id : id}, function(result) {
                $scope.operation = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('sampleApplicationApp:operationUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.operation.id != null) {
                Operation.update($scope.operation, onSaveFinished);
            } else {
                Operation.save($scope.operation, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
