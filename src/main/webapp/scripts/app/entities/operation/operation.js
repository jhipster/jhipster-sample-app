'use strict';

angular.module('sampleApplicationApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('operation', {
                parent: 'entity',
                url: '/operations',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'sampleApplicationApp.operation.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/operation/operations.html',
                        controller: 'OperationController'
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
            .state('operation.detail', {
                parent: 'entity',
                url: '/operation/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'sampleApplicationApp.operation.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/operation/operation-detail.html',
                        controller: 'OperationDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('operation');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Operation', function($stateParams, Operation) {
                        return Operation.get({id : $stateParams.id});
                    }]
                }
            })
            .state('operation.new', {
                parent: 'operation',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/operation/operation-dialog.html',
                        controller: 'OperationDialogController',
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
                    }).result.then(function(result) {
                        $state.go('operation', null, { reload: true });
                    }, function() {
                        $state.go('operation');
                    })
                }]
            })
            .state('operation.edit', {
                parent: 'operation',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/operation/operation-dialog.html',
                        controller: 'OperationDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Operation', function(Operation) {
                                return Operation.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('operation', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('operation.delete', {
                parent: 'operation',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/operation/operation-delete-dialog.html',
                        controller: 'OperationDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Operation', function(Operation) {
                                return Operation.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('operation', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
