'use strict';

jhipsterApp
    .config(['$routeProvider', '$httpProvider', '$translateProvider',
        function ($routeProvider, $httpProvider, $translateProvider) {
            $routeProvider
                .when('/foo', {
                    templateUrl: 'views/foos.html',
                    controller: 'FooController',
                    resolve:{
                        resolvedFoo: ['Foo', function (Foo) {
                            return Foo.query();
                        }]
                    }
                })
        }]);
