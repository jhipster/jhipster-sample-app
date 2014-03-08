'use strict';

jhipsterApp.controller('BooController', ['$scope', 'resolvedBoo', 'Boo',
    function ($scope, resolvedBoo, Boo) {

        $scope.boos = resolvedBoo;

        $scope.create = function () {
            Boo.save($scope.boo,
                function () {
                    $scope.boos = Boo.query();
                    $('#saveBooModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.boo = Boo.get({id: id});
            $('#saveBooModal').modal('show');
        };

        $scope.delete = function (id) {
            Boo.delete({id: id},
                function () {
                    $scope.boos = Boo.query();
                });
        };

        $scope.clear = function () {
            $scope.boo = {id: "", sampleTextAttribute: "", sampleDateAttribute: ""};
        };
    }]);
