'use strict';

describe('dynamicLocale', function() {
  beforeEach(module('tmh.dynamicLocale'));
  beforeEach(module(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('/base/components/angular-i18n/angular-locale_{{locale}}.js');
  }));

  afterEach(inject(function($locale, tmhDynamicLocale) {
    runs(function() {
      tmhDynamicLocale.set('en-us');
    });
    waitsFor(function() {
      return $locale.id === 'en-us';
    }, 'locale not reverted', 2000);
  }));

  it('should (eventually) be able to change the locale', inject(function($locale, tmhDynamicLocale) {
    runs(function() {
      tmhDynamicLocale.set('es');
    });

    waitsFor(function() {
      return $locale.id === 'es';
    }, 'locale not updated', 2000);

    runs(function() {
      expect($locale.id).toBe('es');
      expect($locale.DATETIME_FORMATS.DAY["0"]).toBe("domingo");
    });
  }));

  it('should trigger an even when there it changes the locale', inject(function($locale, tmhDynamicLocale, $rootScope) {
    var callback = jasmine.createSpy();

    runs(function() {
      $rootScope.$on('$localeChangeSuccess', callback);
      tmhDynamicLocale.set('es');
      expect(callback.calls.length).toBe(0);
    });
    waitsFor(function() {
      return $locale.id === 'es';
    }, 'locale not updated', 2000);
    runs(function() {
      expect(callback.calls.length).toBe(1);
      expect(callback.calls[0].args[1]).toEqual('es');
      expect(callback.calls[0].args[2]).toEqual($locale);
    });
  }));

  it('should return a promise that has the new locale', inject(function($locale, tmhDynamicLocale, $rootScope) {
    var result = null;
    runs(function() {
      tmhDynamicLocale.set('es').then(function(newLocale) {
        result = newLocale;
      });
      expect(result).toBe(null);
    });
    waitsFor(function() {
      return result !== null;
    }, 'locale not updated', 2000);
    runs(function() {
      expect(result.id).toEqual('es');
      expect(result).toEqual($locale);

      tmhDynamicLocale.set('it');
    });
    waitsFor(function() {
      return $locale.id === 'it';
    }, 'locale not updated', 2000);
    runs(function() {
      result = null;
      tmhDynamicLocale.set('es').then(function(newLocale) {
        result = newLocale;
      });
      expect(result).toBe(null);
      $rootScope.$apply();
      expect(result.id).toBe('es');
      expect(result).toBe($locale);
    });
  }));

  it('should change the already formatted numbers in the page', inject(function($locale, tmhDynamicLocale, $rootScope, $compile) {
    var element = null;

    runs(function() {
      element = $compile('<span>{{val | number}}</span>')($rootScope);

      $rootScope.val = 1234.5678;
      $rootScope.$apply();
      expect(element.text()).toBe('1,234.568');

      tmhDynamicLocale.set('es');
    });
    waitsFor(function() {
      return $locale.id === 'es';
    }, 'locale not updated', 2000);
    runs(function() {
      expect(element.text()).toBe('1.234,568');
    });
  }));

  it('should keep already loaded locales at tmhDynamicLocaleCache', inject(function($locale, tmhDynamicLocale, tmhDynamicLocaleCache, $rootScope) {
    var esLocale = null;

    runs(function() {
      expect(tmhDynamicLocaleCache.info().size).toBe(0);
      tmhDynamicLocale.set('es');
      expect(tmhDynamicLocaleCache.info().size).toBe(0);
    });
    waitsFor(function() {
      return $locale.id === 'es';
    }, 'locale not updated', 2000);
    runs(function() {
      expect(tmhDynamicLocaleCache.info().size).toBe(1);
      expect(tmhDynamicLocaleCache.get('es')).toEqual($locale);
      esLocale = angular.copy($locale);
      tmhDynamicLocale.set('it');
    });
    waitsFor(function() {
      return $locale.id === 'it';
    }, 'locale not updated', 2000);
    runs(function() {
      expect(tmhDynamicLocaleCache.info().size).toBe(2);
      expect(tmhDynamicLocaleCache.get('es')).toEqual(esLocale);
      expect(tmhDynamicLocaleCache.get('it')).toEqual($locale);
    });
  }));

  it('should use the cache when possible', inject(function($locale, tmhDynamicLocale, tmhDynamicLocaleCache, $rootScope) {
    var callback = jasmine.createSpy();

    runs(function() {
      tmhDynamicLocale.set('es');
    });
    waitsFor(function() {
      return $locale.id === 'es';
    }, 'locale not updated', 2000);
    runs(function() {
      tmhDynamicLocale.set('it');
    });
    waitsFor(function() {
      return $locale.id === 'it';
    }, 'locale not updated', 2000);
    runs(function() {
      tmhDynamicLocaleCache.get('es').DATETIME_FORMATS.DAY["0"] = "Domingo";
      $rootScope.$on('$localeChangeSuccess', callback);
      tmhDynamicLocale.set('es');
      // Changing the locale should be done async even when this is done from the cache
      expect(callback.calls.length).toBe(0);
      expect($locale.id).toBe('it');
      $rootScope.$apply();
      expect($locale.id).toBe('es');
      expect($locale.DATETIME_FORMATS.DAY["0"]).toBe("Domingo");
      expect(callback.calls.length).toBe(1);
    });
  }));

  describe('having a cookie storage', function () {
    beforeEach(module('ngCookies'));
    beforeEach(module(function(tmhDynamicLocaleProvider) {
      tmhDynamicLocaleProvider.useCookieStorage();
    }));

    it('should store the change on the cookie store', inject(function ($locale, $cookieStore, tmhDynamicLocale) {
      runs(function() {
        tmhDynamicLocale.set('es');
        expect($cookieStore.get('tmhDynamicLocale.locale')).toBe(undefined);
      });
      waitsFor(function() {
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        expect($cookieStore.get('tmhDynamicLocale.locale')).toBe('es');
      });
    }));
    describe('reading the locale at initialization', function () {
      beforeEach(inject(function ($cookieStore) {
        $cookieStore.put('tmhDynamicLocale.locale', 'it');
      }));

      it('should load the locale on initialization', inject(function ($locale, tmhDynamicLocale) {
        runs(function() {
          expect($locale.id).toBe('en-us');
        });
        waitsFor(function() {
          return $locale.id === 'it';
        }, 'locale not updated', 2000);
        runs(function() {
          expect($locale.id).toBe('it');
        });
      }));
    });
  });

});
