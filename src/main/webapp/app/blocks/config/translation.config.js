(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .config(translationConfig);

    translationConfig.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider', 'BUILD_TIMESTAMP'];

    function translationConfig($translateProvider, tmhDynamicLocaleProvider, BUILD_TIMESTAMP) {
        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json' + (BUILD_TIMESTAMP ? '?build=' + BUILD_TIMESTAMP : '')
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useStorage('translationStorageProvider');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');
    }
})();
