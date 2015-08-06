'use strict';

angular.module('jhipsterApp')
    .controller('BankAccountDetailController', function ($scope, $rootScope, $stateParams, entity, BankAccount, User, Operation) {
        $scope.bankAccount = entity;
        $scope.load = function (id) {
            BankAccount.get({id: id}, function(result) {
                $scope.bankAccount = result;
            });
        };
        $rootScope.$on('jhipsterApp:bankAccountUpdate', function(event, result) {
            $scope.bankAccount = result;
        });
    });
