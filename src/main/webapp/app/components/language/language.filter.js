(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .filter('findLanguageFromKey', findLanguageFromKey)
        .filter('findLanguageRtlFromKey', findLanguageRtlFromKey);

    var languages = {
        'ca': { name: 'Català' },
        'cs': { name: 'Český' },
        'da': { name: 'Dansk' },
        'de': { name: 'Deutsch' },
        'el': { name: 'Ελληνικά' },
        'en': { name: 'English' },
        'es': { name: 'Español' },
        'et': { name: 'Eesti' },
        'fa': { name: 'فارسی', rtl: true },
        'fr': { name: 'Français' },
        'gl': { name: 'Galego' },
        'hu': { name: 'Magyar' },
        'hi': { name: 'हिंदी' },
        'hy': { name: 'Հայերեն' },
        'it': { name: 'Italiano' },
        'ja': { name: '日本語' },
        'ko': { name: '한국어' },
        'mr': { name: 'मराठी' },
        'nl': { name: 'Nederlands' },
        'pl': { name: 'Polski' },
        'pt-br': { name: 'Português (Brasil)' },
        'pt-pt': { name: 'Português' },
        'ro': { name: 'Română' },
        'ru': { name: 'Русский' },
        'sk': { name: 'Slovenský' },
        'sr': { name: 'Srpski' },
        'sv': { name: 'Svenska' },
        'ta': { name: 'தமிழ்' },
        'th': { name: 'ไทย' },
        'tr': { name: 'Türkçe' },
        'ua': { name: 'Українська' },
        'vi': { name: 'Tiếng Việt' },
        'zh-cn': { name: '中文（简体）' },
        'zh-tw': { name: '繁體中文' }
    };

    function findLanguageFromKey() {
        return findLanguageFromKeyFilter;

        function findLanguageFromKeyFilter(lang) {
            return languages[lang].name;
        }
    }

    function findLanguageRtlFromKey() {
        return findLanguageRtlFromKeyFilter;

        function findLanguageRtlFromKeyFilter(lang) {
            return languages[lang].rtl;
        }
    }

})();
