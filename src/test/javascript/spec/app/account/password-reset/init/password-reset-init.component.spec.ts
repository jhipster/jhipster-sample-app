import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { JhipsterSampleApplicationTestModule } from '../../../../test.module';
import { PasswordResetInitComponent } from 'app/account/password-reset/init/password-reset-init.component';
import { PasswordResetInitService } from 'app/account/password-reset/init/password-reset-init.service';
import { EMAIL_NOT_FOUND_TYPE } from 'app/shared/constants/error.constants';

describe('Component Tests', () => {
  describe('PasswordResetInitComponent', () => {
    let fixture: ComponentFixture<PasswordResetInitComponent>;
    let comp: PasswordResetInitComponent;

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [PasswordResetInitComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PasswordResetInitComponent, '')
        .createComponent(PasswordResetInitComponent);
      comp = fixture.componentInstance;
    });

    it('should define its initial state', () => {
      expect(comp.success).toBe(false);
      expect(comp.error).toBe(false);
      expect(comp.errorEmailNotExists).toBe(false);
    });

    it('sets focus after the view has been initialized', () => {
      const node = {
        focus(): void {}
      };
      comp.email = new ElementRef(node);
      spyOn(node, 'focus');

      comp.ngAfterViewInit();

      expect(node.focus).toHaveBeenCalled();
    });

    it('notifies of success upon successful requestReset', inject([PasswordResetInitService], (service: PasswordResetInitService) => {
      spyOn(service, 'save').and.returnValue(of({}));
      comp.resetRequestForm.patchValue({
        email: 'user@domain.com'
      });

      comp.requestReset();

      expect(service.save).toHaveBeenCalledWith('user@domain.com');
      expect(comp.success).toBe(true);
      expect(comp.error).toBe(false);
      expect(comp.errorEmailNotExists).toBe(false);
    }));

    it('notifies of unknown email upon email address not registered/400', inject(
      [PasswordResetInitService],
      (service: PasswordResetInitService) => {
        spyOn(service, 'save').and.returnValue(
          throwError({
            status: 400,
            error: { type: EMAIL_NOT_FOUND_TYPE }
          })
        );
        comp.resetRequestForm.patchValue({
          email: 'user@domain.com'
        });
        comp.requestReset();

        expect(service.save).toHaveBeenCalledWith('user@domain.com');
        expect(comp.success).toBe(false);
        expect(comp.error).toBe(false);
        expect(comp.errorEmailNotExists).toBe(true);
      }
    ));

    it('notifies of error upon error response', inject([PasswordResetInitService], (service: PasswordResetInitService) => {
      spyOn(service, 'save').and.returnValue(
        throwError({
          status: 503,
          data: 'something else'
        })
      );
      comp.resetRequestForm.patchValue({
        email: 'user@domain.com'
      });
      comp.requestReset();

      expect(service.save).toHaveBeenCalledWith('user@domain.com');
      expect(comp.success).toBe(false);
      expect(comp.errorEmailNotExists).toBe(false);
      expect(comp.error).toBe(true);
    }));
  });
});
