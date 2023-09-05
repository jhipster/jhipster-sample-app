import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';
import { LabelFormService, LabelFormGroup } from './label-form.service';

@Component({
  standalone: true,
  selector: 'jhi-label-update',
  templateUrl: './label-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LabelUpdateComponent implements OnInit {
  isSaving = false;
  label: ILabel | null = null;

  editForm: LabelFormGroup = this.labelFormService.createLabelFormGroup();

  constructor(
    protected labelService: LabelService,
    protected labelFormService: LabelFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ label }) => {
      this.label = label;
      if (label) {
        this.updateForm(label);
      }
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
  }
}
