import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IOperation } from '../operation.model';

@Component({
  standalone: true,
  selector: 'jhi-operation-detail',
  templateUrl: './operation-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class OperationDetailComponent {
  operation = input<IOperation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
