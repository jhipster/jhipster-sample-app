'use strict';

angular.module('sampleApplicationApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


