import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOperation } from 'app/entities/operation/operation.model';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';
import { LabelFormGroup, LabelFormService } from './label-form.service';

@Component({
  standalone: true,
  selector: 'jhi-label-update',
  templateUrl: './label-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LabelUpdateComponent implements OnInit {
  isSaving = false;
  label: ILabel | null = null;

  operationsSharedCollection: IOperation[] = [];

  protected labelService = inject(LabelService);
  protected labelFormService = inject(LabelFormService);
  protected operationService = inject(OperationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LabelFormGroup = this.labelFormService.createLabelFormGroup();

  compareOperation = (o1: IOperation | null, o2: IOperation | null): boolean => this.operationService.compareOperation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ label }) => {
      this.label = label;
      if (label) {
        this.updateForm(label);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const label = this.labelFormService.getLabel(this.editForm);
    if (label.id !== null) {
      this.subscribeToSaveResponse(this.labelService.update(label));
    } else {
      this.subscribeToSaveResponse(this.labelService.create(label));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILabel>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(label: ILabel): void {
    this.label = label;
    this.labelFormService.resetForm(this.editForm, label);

    this.operationsSharedCollection = this.operationService.addOperationToCollectionIfMissing<IOperation>(
      this.operationsSharedCollection,
      ...(label.operations ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.operationService
      .query()
      .pipe(map((res: HttpResponse<IOperation[]>) => res.body ?? []))
      .pipe(
        map((operations: IOperation[]) =>
          this.operationService.addOperationToCollectionIfMissing<IOperation>(operations, ...(this.label?.operations ?? [])),
        ),
      )
      .subscribe((operations: IOperation[]) => (this.operationsSharedCollection = operations));
  }
}
