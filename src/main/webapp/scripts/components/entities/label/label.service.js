'use strict';

angular.module('sampleapplicationApp')
    .factory('Label', function ($resource, DateUtils) {
        return $resource('api/labels/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
