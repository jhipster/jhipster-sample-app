 'use strict';

angular.module('sampleApplicationApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-sampleApplicationApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-sampleApplicationApp-params')});
                }
                return response;
            }
        };
    });
