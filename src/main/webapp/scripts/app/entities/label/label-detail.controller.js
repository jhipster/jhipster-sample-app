'use strict';

angular.module('jhipsterApp')
    .controller('LabelDetailController', function ($scope, $rootScope, $stateParams, entity, Label, Operation) {
        $scope.label = entity;
        $scope.load = function (id) {
            Label.get({id: id}, function(result) {
                $scope.label = result;
            });
        };
        $rootScope.$on('jhipsterApp:labelUpdate', function(event, result) {
            $scope.label = result;
        });
    });
