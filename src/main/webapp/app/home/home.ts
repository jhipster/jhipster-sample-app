import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [TranslateDirective, TranslateModule, RouterLink],
})
export default class Home {
  public readonly account = inject(AccountService).account;

  private readonly router = inject(Router);

  login(): void {
    this.router.navigate(['/login']);
  }
}
