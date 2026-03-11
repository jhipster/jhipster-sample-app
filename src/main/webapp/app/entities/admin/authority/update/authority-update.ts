import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

import { AuthorityFormGroup, AuthorityFormService } from './authority-form.service';

@Component({
  selector: 'jhi-authority-update',
  templateUrl: './authority-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class AuthorityUpdate implements OnInit {
  readonly isSaving = signal(false);
  authority: IAuthority | null = null;

  protected authorityService = inject(AuthorityService);
  protected authorityFormService = inject(AuthorityFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AuthorityFormGroup = this.authorityFormService.createAuthorityFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authority }) => {
      this.authority = authority;
      if (authority) {
        this.updateForm(authority);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const authority = this.authorityFormService.getAuthority(this.editForm);
    this.subscribeToSaveResponse(this.authorityService.create(authority));
  }

  protected subscribeToSaveResponse(result: Observable<IAuthority | null>): void {
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

  protected updateForm(authority: IAuthority): void {
    this.authority = authority;
    this.authorityFormService.resetForm(this.editForm, authority);
  }
}
