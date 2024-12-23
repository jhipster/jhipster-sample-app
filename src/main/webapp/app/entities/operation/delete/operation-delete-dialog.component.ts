import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

@Component({
  templateUrl: './operation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OperationDeleteDialogComponent {
  operation?: IOperation;

  protected operationService = inject(OperationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
