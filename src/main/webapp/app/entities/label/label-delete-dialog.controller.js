(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .controller('LabelDeleteController',LabelDeleteController);

    LabelDeleteController.$inject = ['$uibModalInstance', 'entity', 'Label'];

    function LabelDeleteController($uibModalInstance, entity, Label) {
        var vm = this;
        vm.label = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Label.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
