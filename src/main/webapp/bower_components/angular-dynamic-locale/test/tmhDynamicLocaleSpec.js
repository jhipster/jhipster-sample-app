(function () {
  'use strict';

  describe('dynamicLocale', function() {
    beforeEach(module('tmh.dynamicLocale'));
    beforeEach(module(function(tmhDynamicLocaleProvider) {
      tmhDynamicLocaleProvider.localeLocationPattern('/base/components/angular-i18n/angular-locale_{{locale}}.js');
    }));

    afterEach(inject(function($locale, $timeout, tmhDynamicLocale) {
      runs(function() {
        tmhDynamicLocale.set('en-us');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'en-us';
      }, 'locale not reverted', 2000);
    }));

    it('should (eventually) be able to change the locale', inject(function($locale, $timeout, tmhDynamicLocale) {
      runs(function() {
        tmhDynamicLocale.set('es');
      });

      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);

      runs(function() {
        expect($locale.id).toBe('es');
        expect($locale.DATETIME_FORMATS.DAY["0"]).toBe("domingo");
      });
    }));

    it('should trigger an event when there it changes the locale', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope) {
      var callback = jasmine.createSpy();

      runs(function() {
        $rootScope.$apply();
        $rootScope.$on('$localeChangeSuccess', callback);
        tmhDynamicLocale.set('es');
        expect(callback.calls.length).toBe(0);
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        expect(callback.calls.length).toBe(1);
        expect(callback.calls[0].args[1]).toEqual('es');
        expect(callback.calls[0].args[2]).toEqual($locale);
      });
    }));

    it('should trigger a failure even when the locale change fail', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope) {
      var callback = jasmine.createSpy();

      runs(function() {
        $rootScope.$apply();
        $rootScope.$on('$localeChangeError', callback);
        tmhDynamicLocale.set('invalidLocale');
        expect(callback.calls.length).toBe(0);
      });
      waitsFor(function() {
        $timeout.flush(50);
        return callback.calls.length !== 0;
      }, 'error not generated', 2000);
      runs(function() {
        expect(callback.calls.length).toBe(1);
        expect(callback.calls[0].args[1]).toEqual('invalidLocale');
      });
    }));

    it('should return a promise that has the new locale', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope) {
      var callback = jasmine.createSpy();
      runs(function() {
        tmhDynamicLocale.set('es').then(callback);
        expect(callback.calls.length).toBe(0);
      });
      waitsFor(function() {
        $timeout.flush(50);
        return callback.calls.length !== 0;
      }, 'locale not updated', 2000);
      runs(function() {
        expect(callback.calls[0].args[0].id).toEqual('es');
        expect(callback.calls[0].args[0]).toEqual($locale);

        tmhDynamicLocale.set('it');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'it';
      }, 'locale not updated', 2000);
      runs(function() {
        tmhDynamicLocale.set('es').then(callback);
        expect(callback.calls.length).toBe(1);
        $rootScope.$apply();
        expect(callback.calls.length).toBe(2);
        expect(callback.calls[1].args[0].id).toBe('es');
        expect(callback.calls[1].args[0]).toBe($locale);
      });
    }));

    it('should reject the returned promise if it fails to load the locale', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope) {
      var callback = jasmine.createSpy(),
        errorCallback = jasmine.createSpy();
      runs(function() {
        tmhDynamicLocale.set('invalidLocale').then(callback, errorCallback);
      });
      waitsFor(function() {
        $timeout.flush(50);
        return errorCallback.calls.length;
      }, 'promise not rejected', 2000);
      runs(function() {
        expect(callback.calls.length).toBe(0);
        expect(errorCallback.calls.length).toBe(1);
        expect(errorCallback.calls[0].args[0]).toBe('invalidLocale');
        expect($locale.id).toBe('en-us');
      });
    }));

    it('should be possible to retrieve the locale to be', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope, $compile) {
      runs(function() {
        tmhDynamicLocale.set('es');
        expect(tmhDynamicLocale.get()).toBe('es');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        expect(tmhDynamicLocale.get()).toBe('es');
      });
    }));

    it('should revert the configured locale when the new locale does not exist', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope) {
      var errorCallback = jasmine.createSpy();
      runs(function() {
        tmhDynamicLocale.set('es');
      }); 
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        tmhDynamicLocale.set('invalidLocale').then(undefined, errorCallback);
        expect(tmhDynamicLocale.get()).toBe('invalidLocale');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return errorCallback.calls.length;
      }, 'promise not rejected', 2000);
      runs(function() {
        expect(tmhDynamicLocale.get()).toBe('es');
      });
    }));

    it('should change the already formatted numbers in the page', inject(function($timeout, $locale, tmhDynamicLocale, $rootScope, $compile) {
      var element = null;

      runs(function() {
        element = $compile('<span>{{val | number}}</span>')($rootScope);

        $rootScope.val = 1234.5678;
        $rootScope.$apply();
        expect(element.text()).toBe('1,234.568');

        tmhDynamicLocale.set('es');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        expect(element.text()).toBe('1.234,568');
      });
    }));

    it('should keep already loaded locales at tmhDynamicLocaleCache', inject(function($timeout, $locale, tmhDynamicLocale, tmhDynamicLocaleCache, $rootScope) {
      var esLocale = null;

      runs(function() {
        expect(tmhDynamicLocaleCache.info().size).toBe(0);
        tmhDynamicLocale.set('es');
        expect(tmhDynamicLocaleCache.info().size).toBe(0);
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        expect(tmhDynamicLocaleCache.info().size).toBe(1);
        expect(tmhDynamicLocaleCache.get('es')).toEqual($locale);
        esLocale = angular.copy($locale);
        tmhDynamicLocale.set('it');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'it';
      }, 'locale not updated', 2000);
      runs(function() {
        expect(tmhDynamicLocaleCache.info().size).toBe(2);
        expect(tmhDynamicLocaleCache.get('es')).toEqual(esLocale);
        expect(tmhDynamicLocaleCache.get('it')).toEqual($locale);
      });
    }));

    it('should use the cache when possible', inject(function($timeout, $locale, tmhDynamicLocale, tmhDynamicLocaleCache, $rootScope) {
      var callback = jasmine.createSpy();

      runs(function() {
        tmhDynamicLocale.set('es');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        tmhDynamicLocale.set('it');
      });
      waitsFor(function() {
        $timeout.flush(50);
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

    it('should do a deep copy of the locale elements', inject(function($timeout, $locale, tmhDynamicLocale, tmhDynamicLocaleCache, $rootScope) {
      runs(function() {
        tmhDynamicLocale.set('es');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        $locale.DATETIME_FORMATS.DAY["0"] = "XXX";
        expect($locale.DATETIME_FORMATS.DAY["0"]).not.toBe(tmhDynamicLocaleCache.get('es').DATETIME_FORMATS.DAY["0"]);
      });
    }));

    it('should be able to handle locales with extra elements',  inject(function($timeout, $locale, tmhDynamicLocale, tmhDynamicLocaleCache, $rootScope) {
      var weirdLocale;
      runs(function() {
        tmhDynamicLocale.set('es');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        weirdLocale = angular.copy($locale);
        weirdLocale.id = "xx";
        weirdLocale.EXTRA_PARAMETER = {foo: "FOO"};
        weirdLocale.DATETIME_FORMATS.DAY["7"] = "One More Day";
        tmhDynamicLocaleCache.put('xx', angular.copy(weirdLocale));
        tmhDynamicLocale.set('xx');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'xx';
      }, 'locale not updated', 2000);
      runs(function() {
        expect($locale).toEqual(weirdLocale);
        expect($locale.EXTRA_PARAMETER).toEqual({foo: "FOO"});
        tmhDynamicLocale.set('es');
      });
      waitsFor(function() {
        $timeout.flush(50);
        return $locale.id === 'es';
      }, 'locale not updated', 2000);
      runs(function() {
        expect($locale.EXTRA_PARAMETER).toBeUndefined();
        expect($locale.DATETIME_FORMATS.DAY["7"]).toBeUndefined();
        expect($locale.DATETIME_FORMATS.DAY.length).toBe(7);
      });
    }));


    describe('having a default locale', function() {
      beforeEach(module(function(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.defaultLocale('it');
      }));
      it('should set the locale to the default locale', inject(function($timeout, $locale, $rootScope) {
        runs(function() {
          expect($locale.id).toBe('en-us');
          $rootScope.$apply();
        });
        waitsFor(function() {
          $timeout.flush(50);
          return $locale.id === 'it';
        }, 'locale not updated', 2000);
        runs(function() {
          expect($locale.id).toBe('it');
        });
      }));
    });

    describe('having a cookie storage', function () {
      beforeEach(module('ngCookies'));
      beforeEach(module(function(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.useCookieStorage();
      }));

      it('should store the change on the cookie store', inject(function ($timeout, $locale, $cookieStore, tmhDynamicLocale) {
        runs(function() {
          tmhDynamicLocale.set('es');
          expect($cookieStore.get('tmhDynamicLocale.locale')).toBe(undefined);
        });
        waitsFor(function() {
          $timeout.flush(50);
          return $locale.id === 'es';
        }, 'locale not updated', 2000);
        runs(function() {
          expect($cookieStore.get('tmhDynamicLocale.locale')).toBe('es');
        });
      }));
      describe('reading the locale at initialization', function () {
        beforeEach(inject(function ($cookieStore, $rootScope) {
          $cookieStore.put('tmhDynamicLocale.locale', 'it');
          $rootScope.$apply();
        }));

        it('should load the locale on initialization', inject(function ($timeout, $locale, $rootScope) {
          runs(function() {
            expect($locale.id).toBe('en-us');
          });
          waitsFor(function() {
            $timeout.flush(50);
            return $locale.id === 'it';
          }, 'locale not updated', 2000);
          runs(function() {
            expect($locale.id).toBe('it');
          });
        }));
      });
      describe('and having a default language', function () {
        beforeEach(module(function(tmhDynamicLocaleProvider) {
          tmhDynamicLocaleProvider.defaultLocale('es');
        }));
        beforeEach(inject(function ($cookieStore, $rootScope) {
          $cookieStore.put('tmhDynamicLocale.locale', 'it');
          $rootScope.$apply();
        }));

        it('should load the locale on initialization', inject(function ($timeout, $locale, $rootScope) {
          runs(function() {
            expect($locale.id).toBe('en-us');
          });
          waitsFor(function() {
            $timeout.flush(50);
            return $locale.id === 'it';
          }, 'locale not updated', 2000);
          runs(function() {
            expect($locale.id).toBe('it');
          });
        }));
      });
    });

    describe('loading locales using <script>', function () {
      function countLocales($document, localeId) {
        var count = 0,
          scripts = $document[0].getElementsByTagName('script');

        for (var i = 0; i < scripts.length; ++i) {
          count += (scripts[i].src === 'http://localhost:9876/base/components/angular-i18n/angular-locale_' + localeId + '.js' ? 1 : 0);
        }
        return count;
      }

      it('should load the locales using a <script> tag', inject(function ($timeout, tmhDynamicLocale, $document, $locale) {
        runs(function() {
          tmhDynamicLocale.set('fr');
          expect(countLocales($document, 'fr')).toBe(1);
        });

        waitsFor(function() {
          $timeout.flush(50);
          return $locale.id === 'fr';
        }, 'locale not updated', 2000);

        runs(function() {
          expect(countLocales($document, 'fr')).toBe(0);
        });
      }));

      it('should not load the same locale twice', inject(function ($timeout, tmhDynamicLocale, $rootScope, $document, $locale) {
        runs(function() {
          tmhDynamicLocale.set('ja');
          tmhDynamicLocale.set('ja');
          expect(countLocales($document, 'ja')).toBe(1);
        });

        waitsFor(function() {
          $timeout.flush(50);
          return $locale.id === 'ja';
        }, 'locale not updated', 2000);

        runs(function() {
          expect(countLocales($document, 'ja')).toBe(0);
          tmhDynamicLocale.set('ja');
          expect(countLocales($document, 'ja')).toBe(0);
          tmhDynamicLocale.set('et');
        });

        waitsFor(function() {
          $timeout.flush(50);
          return $locale.id === 'et';
        }, 'locale not updated', 2000);

        runs(function() {
          $rootScope.$apply(function () {
            tmhDynamicLocale.set('ja');
            expect(countLocales($document, 'ja')).toBe(0);
          });
          expect(countLocales($document, 'ja')).toBe(0);
        });
      }));

      it('should return a promise that is resolved when the script is loaded', inject(function ($timeout, tmhDynamicLocale, $document, $locale) {
        var callback = jasmine.createSpy();

        runs(function() {
          tmhDynamicLocale.set('ko').then(callback);
          tmhDynamicLocale.set('ko').then(callback);
          expect(callback).not.toHaveBeenCalled();
        });

        waitsFor(function() {
          $timeout.flush(50);
          return $locale.id === 'ko';
        }, 'locale not updated', 2000);

        runs(function() {
          expect(callback.calls.length).toBe(2);
        });
      }));
    });
  });
}());
