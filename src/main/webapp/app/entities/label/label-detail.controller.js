(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .controller('LabelDetailController', LabelDetailController);

    LabelDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Label', 'Operation'];

    function LabelDetailController($scope, $rootScope, $stateParams, entity, Label, Operation) {
        var vm = this;
        vm.label = entity;
        vm.load = function (id) {
            Label.get({id: id}, function(result) {
                vm.label = result;
            });
        };
        var unsubscribe = $rootScope.$on('sampleApplicationApp:labelUpdate', function(event, result) {
            vm.label = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
