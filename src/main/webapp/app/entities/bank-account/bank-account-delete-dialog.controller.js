(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('BankAccountDeleteController',BankAccountDeleteController);

    BankAccountDeleteController.$inject = ['$uibModalInstance', 'entity', 'BankAccount'];

    function BankAccountDeleteController($uibModalInstance, entity, BankAccount) {
        var vm = this;
        vm.bankAccount = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            BankAccount.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
