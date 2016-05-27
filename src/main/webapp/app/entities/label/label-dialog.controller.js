(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('LabelDialogController', LabelDialogController);

    LabelDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Label', 'Operation'];

    function LabelDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Label, Operation) {
        var vm = this;

        vm.label = entity;
        vm.clear = clear;
        vm.save = save;
        vm.operations = Operation.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.label.id !== null) {
                Label.update(vm.label, onSaveSuccess, onSaveError);
            } else {
                Label.save(vm.label, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('jhipsterSampleApplicationApp:labelUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
