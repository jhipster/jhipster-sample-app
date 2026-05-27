import { ChangeDetectionStrategy, Component, Injector, OnInit, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TranslateModule } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';

import { TranslateDirective } from 'app/shared/language';

import { ProfileService } from './profile.service';

@Component({
  selector: 'jhi-page-ribbon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ribbonEnvSignal?.(); as ribbonEnv) {
      <div class="ribbon">
        <a href="" [jhiTranslate]="'global.ribbon.' + (ribbonEnv ?? '')">{{ { dev: 'Development' }[ribbonEnv ?? ''] }}</a>
      </div>
    }
  `,
  styleUrl: './page-ribbon.scss',
  imports: [TranslateDirective, TranslateModule],
})
export default class PageRibbon implements OnInit {
  ribbonEnvSignal?: Signal<string | undefined>;
  private readonly injector = inject(Injector);
  private readonly profileService = inject(ProfileService);

  ngOnInit(): void {
    const ribbonEnv$: Observable<string | undefined> = this.profileService.getProfileInfo().pipe(map(profileInfo => profileInfo.ribbonEnv));
    this.ribbonEnvSignal = toSignal(ribbonEnv$, { injector: this.injector });
  }
}
