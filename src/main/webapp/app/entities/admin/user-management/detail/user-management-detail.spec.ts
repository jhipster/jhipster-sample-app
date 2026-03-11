import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Authority } from 'app/shared/jhipster/constants';

import { UserManagementDetail } from './user-management-detail';

describe('User Management Detail Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./user-management-detail').then(m => m.UserManagementDetail),
              resolve: {
                userManagement: () =>
                  of({
                    id: 123,
                    login: 'user',
                    firstName: 'first',
                    lastName: 'last',
                    email: 'first@last.com',
                    activated: true,
                    langKey: 'en',
                    authorities: [Authority.USER],
                    createdBy: 'admin',
                  }),
              },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
  });

  describe('Construct', () => {
    it('should call load all on construct', async () => {
      // WHEN
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UserManagementDetail);

      // THEN
      expect(instance.userManagement()).toEqual(
        expect.objectContaining({
          id: 123,
          login: 'user',
          firstName: 'first',
          lastName: 'last',
          email: 'first@last.com',
          activated: true,
          langKey: 'en',
          authorities: [Authority.USER],
          createdBy: 'admin',
        }),
      );
    });
  });
});
