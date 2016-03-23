(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('account', {
            abstract: true,
            parent: 'app'
        });
    }
})();
