'use strict';

angular.module('sampleApplicationApp')
    .controller('LabelController', function ($scope, $state, Label) {

        $scope.labels = [];
        $scope.loadAll = function() {
            Label.query(function(result) {
               $scope.labels = result;
            });
        };
        $scope.loadAll();


        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.label = {
                label: null,
                id: null
            };
        };
    });
