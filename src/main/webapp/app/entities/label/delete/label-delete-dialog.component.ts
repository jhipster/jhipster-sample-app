import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';

@Component({
  templateUrl: './label-delete-dialog.component.html',
})
export class LabelDeleteDialogComponent {
  label?: ILabel;

  constructor(protected labelService: LabelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.labelService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
