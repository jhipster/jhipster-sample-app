'use strict';

angular.module('sampleapplicationApp')
    .controller('OperationController', function ($scope, Operation, ParseLinks) {
        $scope.operations = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Operation.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.operations.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.operations = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Operation.get({id: id}, function(result) {
                $scope.operation = result;
                $('#deleteOperationConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Operation.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteOperationConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.reset();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.operation = {date: null, description: null, amount: null, id: null};
        };
    });
