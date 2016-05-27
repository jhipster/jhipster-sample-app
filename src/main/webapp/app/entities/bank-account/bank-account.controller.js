(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('BankAccountController', BankAccountController);

    BankAccountController.$inject = ['$scope', '$state', 'BankAccount'];

    function BankAccountController ($scope, $state, BankAccount) {
        var vm = this;
        
        vm.bankAccounts = [];

        loadAll();

        function loadAll() {
            BankAccount.query(function(result) {
                vm.bankAccounts = result;
            });
        }
    }
})();
