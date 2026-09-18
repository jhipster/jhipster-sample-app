import { EnvironmentProviders, Provider, inject, provideAppInitializer } from '@angular/core';

import { MissingTranslationHandler, TranslateLoader, TranslateService, provideTranslateService } from '@ngx-translate/core';

import { missingTranslationHandler, translatePartialLoader } from 'app/config';
import { StateStorageService } from 'app/core/auth';

export function provideTranslation(): (Provider | EnvironmentProviders)[] {
  return [
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
    provideAppInitializer(() => {
      const translateService = inject(TranslateService);
      const stateStorageService = inject(StateStorageService);
      translateService.setFallbackLang('en');
      // if the user has changed the language and navigates away from the application and back to it, then use the previously chosen language
      const langKey = stateStorageService.getLocale() ?? 'en';
      translateService.use(langKey);
    }),
  ];
}
