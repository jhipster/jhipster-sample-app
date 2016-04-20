(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .controller('LabelDialogController', LabelDialogController);

    LabelDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Label', 'Operation'];

    function LabelDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Label, Operation) {
        var vm = this;
        vm.label = entity;
        vm.operations = Operation.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('sampleApplicationApp:labelUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.label.id !== null) {
                Label.update(vm.label, onSaveSuccess, onSaveError);
            } else {
                Label.save(vm.label, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
