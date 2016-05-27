(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('LabelDeleteController',LabelDeleteController);

    LabelDeleteController.$inject = ['$uibModalInstance', 'entity', 'Label'];

    function LabelDeleteController($uibModalInstance, entity, Label) {
        var vm = this;

        vm.label = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Label.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
