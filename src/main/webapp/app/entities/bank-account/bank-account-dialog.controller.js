(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('BankAccountDialogController', BankAccountDialogController);

    BankAccountDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'BankAccount', 'User', 'Operation'];

    function BankAccountDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, BankAccount, User, Operation) {
        var vm = this;

        vm.bankAccount = entity;
        vm.clear = clear;
        vm.save = save;
        vm.users = User.query();
        vm.operations = Operation.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.bankAccount.id !== null) {
                BankAccount.update(vm.bankAccount, onSaveSuccess, onSaveError);
            } else {
                BankAccount.save(vm.bankAccount, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('jhipsterSampleApplicationApp:bankAccountUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
