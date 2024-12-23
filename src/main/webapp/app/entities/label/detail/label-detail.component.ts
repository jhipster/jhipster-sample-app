import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ILabel } from '../label.model';

@Component({
  selector: 'jhi-label-detail',
  templateUrl: './label-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class LabelDetailComponent {
  label = input<ILabel | null>(null);

  previousState(): void {
    window.history.back();
  }
}
