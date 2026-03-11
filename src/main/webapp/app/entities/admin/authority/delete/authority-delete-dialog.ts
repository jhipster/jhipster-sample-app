import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

@Component({
  templateUrl: './authority-delete-dialog.html',
  imports: [TranslateDirective, TranslateModule, FormsModule, FontAwesomeModule, AlertError],
})
export class AuthorityDeleteDialog {
  authority?: IAuthority;

  protected readonly authorityService = inject(AuthorityService);
  protected readonly activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(name: string): void {
    this.authorityService.delete(name).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
