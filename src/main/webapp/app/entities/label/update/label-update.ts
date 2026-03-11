import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOperation } from 'app/entities/operation/operation.model';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';

import { LabelFormGroup, LabelFormService } from './label-form.service';

@Component({
  selector: 'jhi-label-update',
  templateUrl: './label-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class LabelUpdate implements OnInit {
  readonly isSaving = signal(false);
  label: ILabel | null = null;

  operationsSharedCollection = signal<IOperation[]>([]);

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
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const label = this.labelFormService.getLabel(this.editForm);
    if (label.id === null) {
      this.subscribeToSaveResponse(this.labelService.create(label));
    } else {
      this.subscribeToSaveResponse(this.labelService.update(label));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ILabel | null>): void {
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
    this.isSaving.set(false);
  }

  protected updateForm(label: ILabel): void {
    this.label = label;
    this.labelFormService.resetForm(this.editForm, label);

    this.operationsSharedCollection.update(operations =>
      this.operationService.addOperationToCollectionIfMissing<IOperation>(operations, ...(label.operations ?? [])),
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
      .subscribe((operations: IOperation[]) => this.operationsSharedCollection.set(operations));
  }
}
