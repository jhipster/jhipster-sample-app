'use strict';

angular.module('sampleapplicationApp')
    .factory('BankAccount', function ($resource, DateUtils) {
        return $resource('api/bankAccounts/:id', {}, {
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
