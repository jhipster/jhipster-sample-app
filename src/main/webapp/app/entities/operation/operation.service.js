(function() {
    'use strict';
    angular
        .module('sampleApplicationApp')
        .factory('Operation', Operation);

    Operation.$inject = ['$resource', 'DateUtils'];

    function Operation ($resource, DateUtils) {
        var resourceUrl =  'api/operations/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.date = DateUtils.convertDateTimeFromServer(data.date);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
