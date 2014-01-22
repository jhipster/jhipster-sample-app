'use strict';

jhipsterApp.controller('FooController', ['$scope', 'resolvedFoo', 'Foo',
    function ($scope, resolvedFoo, Foo) {

        $scope.foos = resolvedFoo;

        $scope.create = function () {
            Foo.save($scope.foo,
                function () {
                    $scope.foos = Foo.query();
                    $('#saveFooModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.foo = Foo.get({id: id});
            $('#saveFooModal').modal('show');
        };

        $scope.delete = function (id) {
            Foo.delete({id: id},
                function () {
                    $scope.foos = Foo.query();
                });
        };

        $scope.clear = function () {
            $scope.foo = {id: "", sampleTextAttribute: "", sampleDateAttribute: ""};
        };
    }]);
