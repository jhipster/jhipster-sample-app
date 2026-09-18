import { Component, DOCUMENT, OnInit, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Router, RouterOutlet, TitleStrategy } from '@angular/router';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth';
import Footer from '../footer/footer';
import PageRibbon from '../profiles/page-ribbon';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.html',
  imports: [RouterOutlet, Footer, PageRibbon],
})
export default class Main implements OnInit {
  private readonly renderer: Renderer2;
  private readonly htmlElement: HTMLElement;

  private readonly router = inject(Router);
  private readonly titleStrategy = inject(TitleStrategy);
  private readonly accountService = inject(AccountService);
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(TranslateService);
  private readonly rootRenderer = inject(RendererFactory2);

  constructor() {
    this.htmlElement = this.document.documentElement;
    this.renderer = this.rootRenderer.createRenderer(this.htmlElement, null);
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.titleStrategy.updateTitle(this.router.routerState.snapshot);
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(this.htmlElement, 'lang', langChangeEvent.lang);
    });
  }
}
