'use strict';

angular.module('sampleApplicationApp')
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService) {
        return {
            responseError: function(response) {
                // If we have an unauthorized request we redirect to the login page
                // Don't do this check on the account API to avoid infinite loop
                var $state = $injector.get('$state');
                if (response.status == 401
                  && response.data.path !== undefined
                  && response.data.path.indexOf("/api/account") == -1
                  && response.data.path.indexOf("/api/authentication") == -1
                  && $state.current.name != 'login'){
                    var Auth = $injector.get('Auth');
                    var to = $rootScope.toState;
                    var params = $rootScope.toStateParams;
                    Auth.logout();
                    $rootScope.previousStateName = to;
                    $rootScope.previousStateNameParams = params;
                    var LoginPopupService = $injector.get('LoginPopupService');
                    LoginPopupService.open();
                }
                return $q.reject(response);
            }
        };
    });
