'use strict';

angular.module('sampleapplicationApp').controller('BankAccountDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'BankAccount', 'User', 'Operation',
        function($scope, $stateParams, $uibModalInstance, entity, BankAccount, User, Operation) {

        $scope.bankAccount = entity;
        $scope.users = User.query();
        $scope.operations = Operation.query();
        $scope.load = function(id) {
            BankAccount.get({id : id}, function(result) {
                $scope.bankAccount = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('sampleapplicationApp:bankAccountUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.bankAccount.id != null) {
                BankAccount.update($scope.bankAccount, onSaveSuccess, onSaveError);
            } else {
                BankAccount.save($scope.bankAccount, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
