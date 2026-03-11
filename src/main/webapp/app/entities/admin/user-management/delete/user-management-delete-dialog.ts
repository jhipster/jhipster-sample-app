import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { UserManagementService } from '../service/user-management.service';
import { IUserManagement } from '../user-management.model';

@Component({
  templateUrl: './user-management-delete-dialog.html',
  imports: [TranslateDirective, TranslateModule, FormsModule, FontAwesomeModule, AlertError],
})
export class UserManagementDeleteDialog {
  userManagement?: IUserManagement;

  protected readonly userManagementService = inject(UserManagementService);
  protected readonly activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(login: string): void {
    this.userManagementService.delete(login).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
