'use strict';

angular.module('sampleApplicationApp')
    .factory('LoginPopupService', function ($modal) {
        return {
            open: function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'scripts/components/login-popup/login-popup.html',
                    controller: 'LoginPopupController',
                    resolve: {
                      translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                          $translatePartialLoader.addPart('login');
                          return $translate.refresh();
                      }]
                    }
                });
            }
        }
    });
