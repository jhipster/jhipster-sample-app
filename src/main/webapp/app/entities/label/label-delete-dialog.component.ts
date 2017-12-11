import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Label } from './label.model';
import { LabelPopupService } from './label-popup.service';
import { LabelService } from './label.service';

@Component({
    selector: 'jhi-label-delete-dialog',
    templateUrl: './label-delete-dialog.component.html'
})
export class LabelDeleteDialogComponent {

    label: Label;

    constructor(
        private labelService: LabelService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.labelService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private labelPopupService: LabelPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.labelPopupService
                .open(LabelDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
