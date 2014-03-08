'use strict';

jhipsterApp
    .config(['$routeProvider', '$httpProvider', '$translateProvider',
        function ($routeProvider, $httpProvider, $translateProvider) {
            $routeProvider
                .when('/boo', {
                    templateUrl: 'views/boos.html',
                    controller: 'BooController',
                    resolve:{
                        resolvedBoo: ['Boo', function (Boo) {
                            return Boo.query();
                        }]
                    }
                })
        }]);
