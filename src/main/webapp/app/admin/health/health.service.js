(function() {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .factory('JhiHealthService', JhiHealthService);

    JhiHealthService.$inject = ['$rootScope', '$http'];

    function JhiHealthService ($rootScope, $http) {
        var service = {
            checkHealth: checkHealth
        };

        return service;

        function checkHealth () {
            return $http.get('management/health').then(function (response) {
                return response.data;
            });
        }
    }
})();
