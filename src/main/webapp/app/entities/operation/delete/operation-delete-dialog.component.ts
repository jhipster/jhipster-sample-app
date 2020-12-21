import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

@Component({
  templateUrl: './operation-delete-dialog.component.html',
})
export class OperationDeleteDialogComponent {
  operation?: IOperation;

  constructor(protected operationService: OperationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
