 'use strict';

angular.module('sampleapplicationApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-sampleapplicationApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-sampleapplicationApp-params')});
                }
                return response;
            },
        };
    });