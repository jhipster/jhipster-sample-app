import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOperation } from 'app/shared/model/operation.model';
import { OperationService } from './operation.service';

@Component({
  templateUrl: './operation-delete-dialog.component.html',
})
export class OperationDeleteDialogComponent {
  operation?: IOperation;

  constructor(protected operationService: OperationService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('operationListModification');
      this.activeModal.close();
    });
  }
}
