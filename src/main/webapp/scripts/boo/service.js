'use strict';

jhipsterApp.factory('Boo', ['$resource',
    function ($resource) {
        return $resource('app/rest/boos/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': { method: 'GET'}
        });
    }]);
