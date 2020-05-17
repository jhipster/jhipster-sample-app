import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgJhipsterModule, translatePartialLoader, missingTranslationHandler, JhiConfigService, JhiLanguageService } from 'ng-jhipster';
import locale from '@angular/common/locales/en';

import * as moment from 'moment';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentAdapter } from 'app/shared/util/datepicker-adapter';

import { AuthInterceptor } from 'app/blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from 'app/blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from 'app/blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from 'app/blocks/interceptor/notification.interceptor';

import { fontAwesomeIcons } from './icons/font-awesome-icons';

@NgModule({
  imports: [
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    NgJhipsterModule.forRoot({
      // set below to true to make alerts look like toast
      alertAsToast: false,
      alertTimeout: 5000,
      i18nEnabled: true,
      defaultI18nLang: 'en',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
        deps: [JhiConfigService],
      },
    }),
  ],
  providers: [
    Title,
    CookieService,
    {
      provide: LOCALE_ID,
      useValue: 'en',
    },
    { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
  ],
})
export class JhipsterSampleApplicationCoreModule {
  constructor(iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig, languageService: JhiLanguageService) {
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    languageService.init();
  }
}
