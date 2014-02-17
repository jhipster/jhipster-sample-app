'use strict';

angular.module('tmh.dynamicLocale', []).provider('tmhDynamicLocale', function() {

  var localeLocationPattern = 'angular/i18n/angular-locale_{{locale}}.js',
    storageFactory = 'tmhDynamicLocaleStorageCache',
    storeKey = 'tmhDynamicLocale.locale';

  /**
   * Loads a script asynchronously
   *
   * @param {string} url The url for the script
   @ @param {function) callback A function to be called once the script is loaded
   */
  function loadScript(url, callback) {
    var script = document.createElement('script'),
      body = document.getElementsByTagName('body')[0];

    script.type = 'text/javascript';
    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' ||
            script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { // Others
      script.onload = function () {
        callback();
      };
    }
    script.src = url;
    script.async = false;
    body.appendChild(script);
  }

  /**
   * Loads a locale and replaces the properties from the current locale with the new locale information
   *
   * @param localeUrl The path to the new locale
   * @param $locale The locale at the curent scope
   */
  function loadLocale(localeUrl, $locale, localeId, $rootScope, $q, localeCache, storage) {

    function overrideValues(oldObject, newObject) {
      angular.forEach(newObject, function(value, key) {
        if (angular.isArray(newObject[key]) || angular.isObject(newObject[key])) {
          overrideValues(oldObject[key], newObject[key]);
        } else { 
          oldObject[key] = newObject[key];
        } 
      });
    } 


    var cachedLocale = localeCache.get(localeId),
      deferred = $q.defer();
    if (cachedLocale) {
      $rootScope.$evalAsync(function() {
        overrideValues($locale, cachedLocale);
        $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
        storage.put(storeKey, localeId);
        deferred.resolve($locale);
      });
    } else {
      loadScript(localeUrl, function () {
        // Create a new injector with the new locale
        var localInjector = angular.injector(['ngLocale']),
          externalLocale = localInjector.get('$locale');

        overrideValues($locale, externalLocale);
        localeCache.put(localeId, externalLocale);

        $rootScope.$apply(function () {
          $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
          storage.put(storeKey, localeId);
          deferred.resolve($locale);
        });
      });
    }
    return deferred.promise;
  }

  this.localeLocationPattern = function(value) {
    if (value) {
      localeLocationPattern = value;
      return this;
    } else {
      return localeLocationPattern;
    }
  };

  this.useStorage = function(storageName) {
    storageFactory = storageName;
  };

  this.useCookieStorage = function() {
    this.useStorage('$cookieStore');
  };

  this.$get = ['$rootScope', '$injector', '$interpolate', '$locale', '$q', 'tmhDynamicLocaleCache', function($rootScope, $injector, interpolate, locale, $q, tmhDynamicLocaleCache) {
    var localeLocation = interpolate(localeLocationPattern),
      storage = $injector.get(storageFactory),
      initialLocale;

    if (initialLocale = storage.get(storeKey)) {
      loadLocale(localeLocation({locale: initialLocale}), locale, initialLocale, $rootScope, $q, tmhDynamicLocaleCache, storage);
    }

    return {
      /**
       * @ngdoc method
       * @description
       * @param {string=} value Sets the locale to the new locale. Changing the locale will trigger
       *    a background task that will retrieve the new locale and configure the current $locale
       *    instance with the information from the new locale
       */
      set: function(value) {
        return loadLocale(localeLocation({locale: value}), locale, value, $rootScope, $q, tmhDynamicLocaleCache, storage);
      }
    };
  }];

}).provider('tmhDynamicLocaleCache', function() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('tmh.dynamicLocales');
  }];
}).provider('tmhDynamicLocaleStorageCache', function() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('tmh.dynamicLocales.store');
  }];
});
