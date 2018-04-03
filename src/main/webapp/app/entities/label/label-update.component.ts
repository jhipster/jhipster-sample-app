import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JhiAlertService } from 'ng-jhipster';

import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { IOperation } from 'app/shared/model/operation.model';
import { OperationService } from 'app/entities/operation';

@Component({
  selector: 'jhi-label-update',
  templateUrl: './label-update.component.html'
})
export class LabelUpdateComponent implements OnInit {
  private _label: ILabel;
  isSaving: boolean;

  operations: IOperation[];

  constructor(
    private jhiAlertService: JhiAlertService,
    private labelService: LabelService,
    private operationService: OperationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.route.data.subscribe(({ label }) => {
      this.label = label.body ? label.body : label;
    });
    this.operationService.query().subscribe(
      (res: HttpResponse<IOperation[]>) => {
        this.operations = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    if (this.label.id !== undefined) {
      this.subscribeToSaveResponse(this.labelService.update(this.label));
    } else {
      this.subscribeToSaveResponse(this.labelService.create(this.label));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ILabel>>) {
    result.subscribe((res: HttpResponse<ILabel>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ILabel) {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackOperationById(index: number, item: IOperation) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
  get label() {
    return this._label;
  }

  set label(label: ILabel) {
    this._label = label;
  }
}
