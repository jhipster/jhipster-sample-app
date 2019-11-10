import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { ILabel, Label } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { IOperation } from 'app/shared/model/operation.model';
import { OperationService } from 'app/entities/operation/operation.service';

@Component({
  selector: 'jhi-label-update',
  templateUrl: './label-update.component.html'
})
export class LabelUpdateComponent implements OnInit {
  isSaving: boolean;

  operations: IOperation[];

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected labelService: LabelService,
    protected operationService: OperationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ label }) => {
      this.updateForm(label);
    });
    this.operationService
      .query()
      .subscribe((res: HttpResponse<IOperation[]>) => (this.operations = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(label: ILabel) {
    this.editForm.patchValue({
      id: label.id,
      label: label.label
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const label = this.createFromForm();
    if (label.id !== undefined) {
      this.subscribeToSaveResponse(this.labelService.update(label));
    } else {
      this.subscribeToSaveResponse(this.labelService.create(label));
    }
  }

  private createFromForm(): ILabel {
    return {
      ...new Label(),
      id: this.editForm.get(['id']).value,
      label: this.editForm.get(['label']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILabel>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackOperationById(index: number, item: IOperation) {
    return item.id;
  }

  getSelected(selectedVals: any[], option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
