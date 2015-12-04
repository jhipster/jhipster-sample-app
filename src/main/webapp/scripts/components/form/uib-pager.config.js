'use strict';

angular.module('sampleApplicationApp')
    .config(function (uibPagerConfig) {
        uibPagerConfig.itemsPerPage = 20;
        uibPagerConfig.previousText = '«';
        uibPagerConfig.nextText = '»';
    });
