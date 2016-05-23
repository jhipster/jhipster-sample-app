(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('OperationDeleteController',OperationDeleteController);

    OperationDeleteController.$inject = ['$uibModalInstance', 'entity', 'Operation'];

    function OperationDeleteController($uibModalInstance, entity, Operation) {
        var vm = this;
        vm.operation = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Operation.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
