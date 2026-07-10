import { EnvironmentProviders, Provider, inject, provideAppInitializer } from '@angular/core';

import { MissingTranslationHandler, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { missingTranslationHandler } from 'app/config/translation.config';
import { StateStorageService } from 'app/core/auth/state-storage.service';

export function provideTranslation(): (Provider | EnvironmentProviders)[] {
  return [
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        resources: [{ prefix: './i18n/', suffix: `.json?_=${I18N_HASH}` }],
      }),
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
