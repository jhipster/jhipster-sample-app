'use strict';

angular.module('sampleapplicationApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('label', {
                parent: 'entity',
                url: '/labels',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'sampleapplicationApp.label.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/label/labels.html',
                        controller: 'LabelController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('label');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('label.detail', {
                parent: 'entity',
                url: '/label/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'sampleapplicationApp.label.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/label/label-detail.html',
                        controller: 'LabelDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('label');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Label', function($stateParams, Label) {
                        return Label.get({id : $stateParams.id});
                    }]
                }
            })
            .state('label.new', {
                parent: 'label',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/label/label-dialog.html',
                        controller: 'LabelDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {label: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('label', null, { reload: true });
                    }, function() {
                        $state.go('label');
                    })
                }]
            })
            .state('label.edit', {
                parent: 'label',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/label/label-dialog.html',
                        controller: 'LabelDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Label', function(Label) {
                                return Label.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('label', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
