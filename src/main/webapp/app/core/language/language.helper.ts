import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageHelper {
  private renderer: Renderer2;

  constructor(private translateService: TranslateService, rootRenderer: RendererFactory2) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }
}
