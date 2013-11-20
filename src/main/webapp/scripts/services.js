'use strict';

/* Services */

jhipsterApp.factory('Account', function($resource){ 
    return $resource('app/rest/account', {}, {
    });
});

jhipsterApp.factory('Password', function($resource) {
    return $resource('app/rest/account/change_password', {}, {
    });
});

jhipsterApp.factory('Sessions', function($resource) {
    return $resource('app/rest/account/sessions/:series', {}, {
        'get': { method: 'GET', isArray: true}
    });
});

jhipsterApp.factory('Metrics', function($resource) {
    return $resource('/metrics/metrics', {}, {
        'get': { method: 'GET'}
    });
});

jhipsterApp.factory('AuthenticationSharedService', function($rootScope, $http) {
    return {
        message: '',
        prepForBroadcast: function(msg) {
            this.message = msg;
            this.broadcastItem();
        },
        broadcastItem: function() {
            $rootScope.$broadcast("authenticationEvent");
        },
        login: function (param) {
            var that = this;
            var data ="j_username=" + param.username +"&j_password=" + param.password +"&_spring_security_remember_me=" + param.rememberMe +"&submit=Login";
            $http.post('/app/authentication', data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).success(function (data, status, headers, config) {
                that.prepForBroadcast("login");
                if(param.success){
                    param.success(data, status, headers, config);
                }
            }).error(function (data, status, headers, config) {
                $scope.authenticationError = true;
                if(param.error){
                    param.error(data, status, headers, config);
                }
            });
        }
    };
});

jhipsterApp.factory('LogsService', function($http) {
    return {
        findAll: function () {
            return $http.get('app/rest/logs');
        },
        changeLevel: function (loggerName, newLevel) {
            return $http.get('app/rest/logs/change/' + loggerName + '/' + newLevel);
        }
    }
});
