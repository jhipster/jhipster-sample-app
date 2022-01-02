import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILabel, Label } from '../label.model';
import { LabelService } from '../service/label.service';

@Component({
  selector: 'jhi-label-update',
  templateUrl: './label-update.component.html',
})
export class LabelUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required, Validators.minLength(3)]],
  });

  constructor(protected labelService: LabelService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ label }) => {
      this.updateForm(label);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const label = this.createFromForm();
    if (label.id !== undefined) {
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
    this.editForm.patchValue({
      id: label.id,
      label: label.label,
    });
  }

  protected createFromForm(): ILabel {
    return {
      ...new Label(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
