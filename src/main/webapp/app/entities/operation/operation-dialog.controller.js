(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('OperationDialogController', OperationDialogController);

    OperationDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Operation', 'BankAccount', 'Label'];

    function OperationDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Operation, BankAccount, Label) {
        var vm = this;

        vm.operation = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.bankaccounts = BankAccount.query();
        vm.labels = Label.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.operation.id !== null) {
                Operation.update(vm.operation, onSaveSuccess, onSaveError);
            } else {
                Operation.save(vm.operation, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('jhipsterSampleApplicationApp:operationUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.date = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
