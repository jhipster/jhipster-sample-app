import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IOperation } from '../operation.model';

@Component({
  selector: 'jhi-operation-detail',
  templateUrl: './operation-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe],
})
export class OperationDetail {
  readonly operation = input<IOperation | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
