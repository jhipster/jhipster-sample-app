(function() {
    'use strict';
    angular
        .module('jhipsterSampleApplicationApp')
        .factory('Label', Label);

    Label.$inject = ['$resource'];

    function Label ($resource) {
        var resourceUrl =  'api/labels/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
