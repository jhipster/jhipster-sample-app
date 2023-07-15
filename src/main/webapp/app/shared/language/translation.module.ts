import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { translatePartialLoader, missingTranslationHandler } from 'app/config/translation.config';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
  ],
})
export class TranslationModule {
  constructor(private translateService: TranslateService, private stateStorageService: StateStorageService) {
    this.translateService.setDefaultLang('en');
    // if user have changed language and navigates away from the application and back to the application then use previously choosed language
    const langKey = this.stateStorageService.getLocale() ?? 'en';
    this.translateService.use(langKey);
  }
}
