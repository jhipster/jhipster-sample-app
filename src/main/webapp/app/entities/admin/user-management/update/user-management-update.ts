import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { LANGUAGES } from 'app/config/language.constants';
import { AlertError } from 'app/shared/alert/alert-error';
import { FindLanguageFromKeyPipe, TranslateDirective } from 'app/shared/language';
import { AuthorityService } from '../../authority/service/authority.service';
import { UserManagementService } from '../service/user-management.service';
import { IUserManagement } from '../user-management.model';

const userTemplate = {} as IUserManagement;

const newUser: IUserManagement = {
  langKey: 'en',
  activated: true,
} as IUserManagement;

@Component({
  selector: 'jhi-user-management-update',
  templateUrl: './user-management-update.html',
  imports: [FindLanguageFromKeyPipe, TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class UserManagementUpdate implements OnInit {
  languages = LANGUAGES;
  readonly isSaving = signal(false);

  editForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    login: new FormControl(userTemplate.login, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    firstName: new FormControl(userTemplate.firstName, { validators: [Validators.maxLength(50)] }),
    lastName: new FormControl(userTemplate.lastName, { validators: [Validators.maxLength(50)] }),
    email: new FormControl(userTemplate.email, {
      nonNullable: true,
      validators: [Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    activated: new FormControl(userTemplate.activated, { nonNullable: true }),
    langKey: new FormControl(userTemplate.langKey, { nonNullable: true }),
    authorities: new FormControl(userTemplate.authorities, { nonNullable: true }),
  });

  protected readonly authorityService = inject(AuthorityService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly authorities = computed(() => this.authorityService.authorities().map(authority => authority.name));
  private readonly userService = inject(UserManagementService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.authorityService.authoritiesParams.set({});
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ userManagement }) => {
      if (userManagement) {
        this.editForm.reset(userManagement);
      } else {
        this.editForm.reset(newUser);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const user = this.editForm.getRawValue();
    if (user.id === null) {
      this.userService.create(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    } else {
      this.userService.update(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    }
  }

  private onSaveSuccess(): void {
    this.isSaving.set(false);
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving.set(false);
  }
}
