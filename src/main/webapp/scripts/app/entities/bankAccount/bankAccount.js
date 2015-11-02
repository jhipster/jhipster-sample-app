'use strict';

angular.module('sampleApplicationApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('bankAccount', {
                parent: 'entity',
                url: '/bankAccounts',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'sampleApplicationApp.bankAccount.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/bankAccount/bankAccounts.html',
                        controller: 'BankAccountController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('bankAccount');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('bankAccount.detail', {
                parent: 'entity',
                url: '/bankAccount/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'sampleApplicationApp.bankAccount.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/bankAccount/bankAccount-detail.html',
                        controller: 'BankAccountDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('bankAccount');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'BankAccount', function($stateParams, BankAccount) {
                        return BankAccount.get({id : $stateParams.id});
                    }]
                }
            })
            .state('bankAccount.new', {
                parent: 'bankAccount',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/bankAccount/bankAccount-dialog.html',
                        controller: 'BankAccountDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    balance: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('bankAccount', null, { reload: true });
                    }, function() {
                        $state.go('bankAccount');
                    })
                }]
            })
            .state('bankAccount.edit', {
                parent: 'bankAccount',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/bankAccount/bankAccount-dialog.html',
                        controller: 'BankAccountDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['BankAccount', function(BankAccount) {
                                return BankAccount.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('bankAccount', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('bankAccount.delete', {
                parent: 'bankAccount',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/bankAccount/bankAccount-delete-dialog.html',
                        controller: 'BankAccountDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['BankAccount', function(BankAccount) {
                                return BankAccount.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('bankAccount', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
