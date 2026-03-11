import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-error',
  imports: [TranslateDirective, TranslateModule],
  templateUrl: './error.html',
})
export default class Error implements OnInit, OnDestroy {
  readonly errorMessage = signal<string | undefined>(undefined);
  errorKey?: string;
  langChangeSubscription?: Subscription;

  private readonly translateService = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      if (routeData.errorMessage) {
        this.errorKey = routeData.errorMessage;
        this.getErrorMessageTranslation();
        this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => this.getErrorMessageTranslation());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private getErrorMessageTranslation(): void {
    this.errorMessage.set('');
    if (this.errorKey) {
      this.translateService.get(this.errorKey).subscribe(translatedErrorMessage => {
        this.errorMessage.set(translatedErrorMessage);
      });
    }
  }
}
