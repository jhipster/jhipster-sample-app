'use strict';

angular.module('sampleapplicationApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


