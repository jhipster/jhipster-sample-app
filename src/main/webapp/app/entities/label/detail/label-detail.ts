import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ILabel } from '../label.model';

@Component({
  selector: 'jhi-label-detail',
  templateUrl: './label-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class LabelDetail {
  readonly label = input<ILabel | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
