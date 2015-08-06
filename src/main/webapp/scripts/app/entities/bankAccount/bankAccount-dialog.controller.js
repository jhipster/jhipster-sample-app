'use strict';

angular.module('jhipsterApp').controller('BankAccountDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'BankAccount', 'User', 'Operation',
        function($scope, $stateParams, $modalInstance, entity, BankAccount, User, Operation) {

        $scope.bankAccount = entity;
        $scope.users = User.query();
        $scope.operations = Operation.query();
        $scope.load = function(id) {
            BankAccount.get({id : id}, function(result) {
                $scope.bankAccount = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('jhipsterApp:bankAccountUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.bankAccount.id != null) {
                BankAccount.update($scope.bankAccount, onSaveFinished);
            } else {
                BankAccount.save($scope.bankAccount, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
