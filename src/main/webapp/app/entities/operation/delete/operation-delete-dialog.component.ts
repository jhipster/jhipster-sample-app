import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

@Component({
  standalone: true,
  templateUrl: './operation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OperationDeleteDialogComponent {
  operation?: IOperation;

  constructor(
    protected operationService: OperationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
