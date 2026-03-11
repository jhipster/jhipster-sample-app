import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/operators';

import { TranslateDirective } from 'app/shared/language';

import { ActivateService } from './activate.service';

@Component({
  selector: 'jhi-activate',
  imports: [RouterLink, TranslateDirective, TranslateModule],
  templateUrl: './activate.html',
})
export default class Activate implements OnInit {
  readonly error = signal(false);
  readonly success = signal(false);

  private readonly activateService = inject(ActivateService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.pipe(mergeMap(params => this.activateService.get(params.key))).subscribe({
      next: () => this.success.set(true),
      error: () => this.error.set(true),
    });
  }
}
