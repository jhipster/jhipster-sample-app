(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('LabelController', LabelController);

    LabelController.$inject = ['$scope', '$state', 'Label'];

    function LabelController ($scope, $state, Label) {
        var vm = this;
        vm.labels = [];
        vm.loadAll = function() {
            Label.query(function(result) {
                vm.labels = result;
            });
        };

        vm.loadAll();
        
    }
})();
