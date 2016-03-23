(function () {
    'use strict';

    angular
        .module('sampleApplicationApp')
        .config(pagerConfig);

    function pagerConfig(uibPagerConfig, paginationConstants) {
        uibPagerConfig.itemsPerPage = paginationConstants.itemsPerPage;
        uibPagerConfig.previousText = '«';
        uibPagerConfig.nextText = '»';
    }
})();
