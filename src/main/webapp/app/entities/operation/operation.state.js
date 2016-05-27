(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('operation', {
            parent: 'entity',
            url: '/operation',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/operation/operations.html',
                    controller: 'OperationController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('operation');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('operation-detail', {
            parent: 'entity',
            url: '/operation/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jhipsterSampleApplicationApp.operation.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/operation/operation-detail.html',
                    controller: 'OperationDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('operation');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Operation', function($stateParams, Operation) {
                    return Operation.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('operation.new', {
            parent: 'operation',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/operation/operation-dialog.html',
                    controller: 'OperationDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                date: null,
                                description: null,
                                amount: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('operation', null, { reload: true });
                }, function() {
                    $state.go('operation');
                });
            }]
        })
        .state('operation.edit', {
            parent: 'operation',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/operation/operation-dialog.html',
                    controller: 'OperationDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Operation', function(Operation) {
                            return Operation.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('operation', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('operation.delete', {
            parent: 'operation',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/operation/operation-delete-dialog.html',
                    controller: 'OperationDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Operation', function(Operation) {
                            return Operation.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('operation', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
