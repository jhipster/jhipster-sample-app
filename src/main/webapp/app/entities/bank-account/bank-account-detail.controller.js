(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .controller('BankAccountDetailController', BankAccountDetailController);

    BankAccountDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'BankAccount', 'User', 'Operation'];

    function BankAccountDetailController($scope, $rootScope, $stateParams, entity, BankAccount, User, Operation) {
        var vm = this;
        vm.bankAccount = entity;
        
        var unsubscribe = $rootScope.$on('sampleApplicationApp:bankAccountUpdate', function(event, result) {
            vm.bankAccount = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
