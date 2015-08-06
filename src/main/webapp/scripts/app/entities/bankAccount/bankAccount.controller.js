'use strict';

angular.module('jhipsterApp')
    .controller('BankAccountController', function ($scope, BankAccount) {
        $scope.bankAccounts = [];
        $scope.loadAll = function() {
            BankAccount.query(function(result) {
               $scope.bankAccounts = result;
            });
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            BankAccount.get({id: id}, function(result) {
                $scope.bankAccount = result;
                $('#deleteBankAccountConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            BankAccount.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteBankAccountConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.bankAccount = {name: null, balance: null, id: null};
        };
    });
