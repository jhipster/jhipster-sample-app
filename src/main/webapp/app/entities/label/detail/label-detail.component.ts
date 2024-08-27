import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ILabel } from '../label.model';

@Component({
  standalone: true,
  selector: 'jhi-label-detail',
  templateUrl: './label-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LabelDetailComponent {
  label = input<ILabel | null>(null);

  previousState(): void {
    window.history.back();
  }
}
