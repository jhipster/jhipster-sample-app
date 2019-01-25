import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from './label.service';

@Component({
    selector: 'jhi-label-delete-dialog',
    templateUrl: './label-delete-dialog.component.html'
})
export class LabelDeleteDialogComponent {
    label: ILabel;

    constructor(protected labelService: LabelService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.labelService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'labelListModification',
                content: 'Deleted an label'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-label-delete-popup',
    template: ''
})
export class LabelDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ label }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(LabelDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.label = label;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/label', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/label', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
