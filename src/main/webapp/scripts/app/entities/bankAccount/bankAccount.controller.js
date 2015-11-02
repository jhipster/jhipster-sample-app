'use strict';

angular.module('sampleApplicationApp')
    .controller('BankAccountController', function ($scope, $state, $modal, BankAccount) {
        $scope.bankAccounts = [];
        $scope.loadAll = function() {
            BankAccount.query(function(result) {
               $scope.bankAccounts = result;
            });
        };
        $scope.loadAll();


        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.bankAccount = {
                name: null,
                balance: null,
                id: null
            };
        };
    });
