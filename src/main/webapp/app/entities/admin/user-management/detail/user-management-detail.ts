import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { TranslateDirective } from 'app/shared/language';
import { IUserManagement } from '../user-management.model';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './user-management-detail.html',
  imports: [FontAwesomeModule, DatePipe, TranslateDirective, TranslateModule],
})
export class UserManagementDetail {
  readonly userManagement = input<IUserManagement | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
