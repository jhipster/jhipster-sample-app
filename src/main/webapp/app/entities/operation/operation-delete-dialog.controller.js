(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('OperationDeleteController',OperationDeleteController);

    OperationDeleteController.$inject = ['$uibModalInstance', 'entity', 'Operation'];

    function OperationDeleteController($uibModalInstance, entity, Operation) {
        var vm = this;

        vm.operation = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Operation.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
