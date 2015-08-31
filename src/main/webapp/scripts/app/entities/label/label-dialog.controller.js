'use strict';

angular.module('sampleapplicationApp').controller('LabelDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Label', 'Operation',
        function($scope, $stateParams, $modalInstance, entity, Label, Operation) {

        $scope.label = entity;
        $scope.operations = Operation.query();
        $scope.load = function(id) {
            Label.get({id : id}, function(result) {
                $scope.label = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('sampleapplicationApp:labelUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.label.id != null) {
                Label.update($scope.label, onSaveFinished);
            } else {
                Label.save($scope.label, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
