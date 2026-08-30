import { Service, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

@Service()
export class AppPageTitleStrategy extends TitleStrategy {
  private readonly translateService = inject(TranslateService);
  private readonly title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    let pageTitle = this.buildTitle(routerState);
    pageTitle ??= 'global.title';
    this.translateService.get(pageTitle).subscribe(title => {
      this.title.setTitle(title);
    });
  }
}
