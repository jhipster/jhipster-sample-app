import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginService } from 'app/core/login/login.service';
import { JhiLoginModalComponent } from 'app/shared/login/login.component';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { MockLoginService } from '../../../helpers/mock-login.service';
import { MockStateStorageService } from '../../../helpers/mock-state-storage.service';

describe('Component Tests', () => {
  describe('LoginComponent', () => {
    let comp: JhiLoginModalComponent;
    let fixture: ComponentFixture<JhiLoginModalComponent>;
    let mockLoginService: any;
    let mockStateStorageService: any;
    let mockRouter: any;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [JhiLoginModalComponent],
        providers: [
          FormBuilder,
          {
            provide: LoginService,
            useClass: MockLoginService
          },
          {
            provide: StateStorageService,
            useClass: MockStateStorageService
          }
        ]
      })
        .overrideTemplate(JhiLoginModalComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(JhiLoginModalComponent);
      comp = fixture.componentInstance;
      mockLoginService = fixture.debugElement.injector.get(LoginService);
      mockStateStorageService = fixture.debugElement.injector.get(StateStorageService);
      mockRouter = fixture.debugElement.injector.get(Router);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    it('should authenticate the user upon login when previous state was set', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        const credentials = {
          username: 'admin',
          password: 'admin',
          rememberMe: true
        };

        comp.loginForm.patchValue({
          username: 'admin',
          password: 'admin',
          rememberMe: true
        });
        mockLoginService.setResponse({});
        mockStateStorageService.setResponse('admin/users?page=0');

        // WHEN/
        comp.login();
        tick(); // simulate async

        // THEN
        expect(comp.authenticationError).toEqual(false);
        expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('login success');
        expect(mockEventManager.broadcastSpy).toHaveBeenCalledTimes(1);
        expect(mockLoginService.loginSpy).toHaveBeenCalledWith(credentials);
        expect(mockStateStorageService.getUrlSpy).toHaveBeenCalledTimes(1);
        expect(mockStateStorageService.storeUrlSpy).toHaveBeenCalledWith(null);
        expect(mockRouter.navigateByUrlSpy).toHaveBeenCalledWith('admin/users?page=0');
      })
    ));

    it('should authenticate the user upon login when previous state was not set', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        const credentials = {
          username: 'admin',
          password: 'admin',
          rememberMe: true
        };
        comp.loginForm.patchValue({
          username: 'admin',
          password: 'admin',
          rememberMe: true
        });
        mockLoginService.setResponse({});
        mockStateStorageService.setResponse(null);

        // WHEN
        comp.login();
        tick(); // simulate async

        // THEN
        expect(comp.authenticationError).toEqual(false);
        expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('login success');
        expect(mockEventManager.broadcastSpy).toHaveBeenCalledTimes(1);
        expect(mockLoginService.loginSpy).toHaveBeenCalledWith(credentials);
        expect(mockStateStorageService.getUrlSpy).toHaveBeenCalledTimes(1);
        expect(mockStateStorageService.storeUrlSpy).not.toHaveBeenCalled();
        expect(mockRouter.navigateSpy).not.toHaveBeenCalled();
      })
    ));

    it('should empty the credentials upon cancel', () => {
      // GIVEN

      comp.loginForm.patchValue({
        username: 'admin',
        password: 'admin'
      });

      const expected = {
        username: '',
        password: '',
        rememberMe: true
      };

      // WHEN
      comp.cancel();

      // THEN
      expect(comp.authenticationError).toEqual(false);
      expect(comp.loginForm.get('username').value).toEqual(expected.username);
      expect(comp.loginForm.get('password').value).toEqual(expected.password);
      expect(comp.loginForm.get('rememberMe').value).toEqual(expected.rememberMe);
      expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('cancel');
    });

    it('should redirect user when register', () => {
      // WHEN
      comp.register();

      // THEN
      expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('to state register');
      expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/register']);
    });

    it('should redirect user when request password', () => {
      // WHEN
      comp.requestResetPassword();

      // THEN
      expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('to state requestReset');
      expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/reset', 'request']);
    });
  });
});
