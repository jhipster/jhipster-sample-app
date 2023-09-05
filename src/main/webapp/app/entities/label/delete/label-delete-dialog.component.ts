import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';

@Component({
  standalone: true,
  templateUrl: './label-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LabelDeleteDialogComponent {
  label?: ILabel;

  constructor(
    protected labelService: LabelService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.labelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
