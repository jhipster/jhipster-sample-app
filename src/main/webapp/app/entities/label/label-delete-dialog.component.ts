import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from './label.service';

@Component({
  templateUrl: './label-delete-dialog.component.html'
})
export class LabelDeleteDialogComponent {
  label: ILabel;

  constructor(protected labelService: LabelService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.labelService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'labelListModification',
        content: 'Deleted an label'
      });
      this.activeModal.dismiss(true);
    });
  }
}
