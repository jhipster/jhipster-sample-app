(function() {
    'use strict';
    angular
        .module('sampleApplicationApp')
        .factory('BankAccount', BankAccount);

    BankAccount.$inject = ['$resource'];

    function BankAccount ($resource) {
        var resourceUrl =  'api/bank-accounts/:id';

        return $resource(resourceUrl, {}, {
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
    }
})();
