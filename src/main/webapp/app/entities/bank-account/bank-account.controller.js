(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .controller('BankAccountController', BankAccountController);

    BankAccountController.$inject = ['$scope', '$state', 'BankAccount'];

    function BankAccountController ($scope, $state, BankAccount) {
        var vm = this;
        vm.bankAccounts = [];
        vm.loadAll = function() {
            BankAccount.query(function(result) {
                vm.bankAccounts = result;
            });
        };

        vm.loadAll();
        
    }
})();
