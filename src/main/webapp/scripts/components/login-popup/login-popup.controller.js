'use strict';

angular.module('sampleApplicationApp')
    .controller('LoginPopupController', function ($rootScope, $scope, $state, $timeout, Auth, $modalInstance) {
        $scope.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        $scope.authenticationError = false;

        $timeout(function (){angular.element('[ng-model="username"]').focus();});

        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.credentials.username,
                password: $scope.credentials.password,
                rememberMe: $scope.credentials.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                $modalInstance.close();
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };

        $scope.cancel = function () {
          $scope.credentials = {
              username: null,
              password: null,
              rememberMe: true
          };
          $scope.authenticationError = false;
          $modalInstance.dismiss('cancel');
        };
    });
