import { Component, AfterViewInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { EMAIL_NOT_FOUND_TYPE } from 'app/shared/constants/error.constants';
import { PasswordResetInitService } from './password-reset-init.service';

@Component({
  selector: 'jhi-password-reset-init',
  templateUrl: './password-reset-init.component.html'
})
export class PasswordResetInitComponent implements AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef;

  error = false;
  errorEmailNotExists = false;
  success = false;
  resetRequestForm = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]]
  });

  constructor(private passwordResetInitService: PasswordResetInitService, private renderer: Renderer, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.email) {
      this.renderer.invokeElementMethod(this.email.nativeElement, 'focus', []);
    }
  }

  requestReset(): void {
    this.error = false;
    this.errorEmailNotExists = false;

    this.passwordResetInitService.save(this.resetRequestForm.get(['email'])!.value).subscribe(
      () => (this.success = true),
      (response: HttpErrorResponse) => {
        if (response.status === 400 && response.error.type === EMAIL_NOT_FOUND_TYPE) {
          this.errorEmailNotExists = true;
        } else {
          this.error = true;
        }
      }
    );
  }
}
