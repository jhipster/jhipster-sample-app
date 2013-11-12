'use strict';

/* Services */

jhipsterApp.factory('Account', function($resource){
        return $resource('app/rest/account', {}, {
        });
    });

jhipsterApp.factory('Password', function($resource){
    return $resource('app/rest/account/change_password', {}, {
    });
});

jhipsterApp.factory('Sessions', function($resource){
    return $resource('app/rest/account/sessions/:series', {}, {
        'get': { method: 'GET', isArray: true}
    });
});

jhipsterApp.factory('Metrics', function($resource){
    return $resource('/metrics/metrics', {}, {
        'get': { method: 'GET'}
    });
});

jhipsterApp.factory('AuthenticationSharedService', function($rootScope) {
    var authenticationSharedService = {};

    authenticationSharedService.message = '';

    authenticationSharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    authenticationSharedService.broadcastItem = function() {
        $rootScope.$broadcast("authenticationEvent");
    };

    return authenticationSharedService;
});
