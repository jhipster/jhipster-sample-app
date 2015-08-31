'use strict';

angular.module('sampleapplicationApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
