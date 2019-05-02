import { ComponentFixture, TestBed, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';

import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared';
import { Register } from 'app/account/register/register.service';
import { RegisterComponent } from 'app/account/register/register.component';

describe('Component Tests', () => {
  describe('RegisterComponent', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let comp: RegisterComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [RegisterComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(RegisterComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      comp = fixture.componentInstance;
      comp.ngOnInit();
    });

    it('should ensure the two passwords entered match', () => {
      comp.registerForm.patchValue({
        password: 'password',
        confirmPassword: 'non-matching'
      });

      comp.register();

      expect(comp.doNotMatch).toEqual('ERROR');
    });

    it('should update success to OK after creating an account', inject(
      [Register, JhiLanguageService],
      fakeAsync((service: Register, mockTranslate: MockLanguageService) => {
        spyOn(service, 'save').and.returnValue(of({}));
        comp.registerForm.patchValue({
          password: 'password',
          confirmPassword: 'password'
        });

        comp.register();
        tick();

        expect(service.save).toHaveBeenCalledWith({
          email: '',
          password: 'password',
          login: '',
          langKey: 'en'
        });
        expect(comp.success).toEqual(true);
        expect(mockTranslate.getCurrentSpy).toHaveBeenCalled();
        expect(comp.errorUserExists).toBeNull();
        expect(comp.errorEmailExists).toBeNull();
        expect(comp.error).toBeNull();
      })
    ));

    it('should notify of user existence upon 400/login already in use', inject(
      [Register],
      fakeAsync((service: Register) => {
        spyOn(service, 'save').and.returnValue(
          throwError({
            status: 400,
            error: { type: LOGIN_ALREADY_USED_TYPE }
          })
        );
        comp.registerForm.patchValue({
          password: 'password',
          confirmPassword: 'password'
        });

        comp.register();
        tick();

        expect(comp.errorUserExists).toEqual('ERROR');
        expect(comp.errorEmailExists).toBeNull();
        expect(comp.error).toBeNull();
      })
    ));

    it('should notify of email existence upon 400/email address already in use', inject(
      [Register],
      fakeAsync((service: Register) => {
        spyOn(service, 'save').and.returnValue(
          throwError({
            status: 400,
            error: { type: EMAIL_ALREADY_USED_TYPE }
          })
        );
        comp.registerForm.patchValue({
          password: 'password',
          confirmPassword: 'password'
        });

        comp.register();
        tick();

        expect(comp.errorEmailExists).toEqual('ERROR');
        expect(comp.errorUserExists).toBeNull();
        expect(comp.error).toBeNull();
      })
    ));

    it('should notify of generic error', inject(
      [Register],
      fakeAsync((service: Register) => {
        spyOn(service, 'save').and.returnValue(
          throwError({
            status: 503
          })
        );
        comp.registerForm.patchValue({
          password: 'password',
          confirmPassword: 'password'
        });

        comp.register();
        tick();

        expect(comp.errorUserExists).toBeNull();
        expect(comp.errorEmailExists).toBeNull();
        expect(comp.error).toEqual('ERROR');
      })
    ));
  });
});
