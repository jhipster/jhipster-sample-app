(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('LabelController', LabelController);

    LabelController.$inject = ['$scope', '$state', 'Label'];

    function LabelController ($scope, $state, Label) {
        var vm = this;

        vm.labels = [];

        loadAll();

        function loadAll() {
            Label.query(function(result) {
                vm.labels = result;
            });
        }
    }
})();
