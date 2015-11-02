'use strict';

angular.module('sampleApplicationApp')
	.controller('BankAccountDeleteController', function($scope, $modalInstance, entity, BankAccount) {

        $scope.bankAccount = entity;
        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            BankAccount.delete({id: id},
                function () {
                    $modalInstance.close(true);
                });
        };

    });