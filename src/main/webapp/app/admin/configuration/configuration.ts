import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { TranslateDirective } from 'app/shared/language';
import { SortByDirective, SortDirective, SortService, sortStateSignal } from 'app/shared/sort';

import { Bean, PropertySource } from './configuration.model';
import { ConfigurationService } from './configuration.service';

@Component({
  selector: 'jhi-configuration',
  templateUrl: './configuration.html',
  imports: [FontAwesomeModule, FormsModule, SortDirective, SortByDirective, KeyValuePipe, JsonPipe, TranslateDirective, TranslateModule],
})
export default class Configuration implements OnInit {
  readonly allBeans = signal<Bean[] | undefined>(undefined);
  readonly beansFilter = signal<string>('');
  readonly propertySources = signal<PropertySource[]>([]);
  sortState = sortStateSignal({ predicate: 'prefix', order: 'asc' });
  readonly beans = computed(() => {
    let data = this.allBeans() ?? [];
    const beansFilter = this.beansFilter();
    if (beansFilter) {
      data = data.filter(bean => bean.prefix.toLowerCase().includes(beansFilter.toLowerCase()));
    }

    const { order, predicate } = this.sortState();
    if (predicate && order) {
      data = data.sort(this.sortService.startSort({ predicate, order }));
    }
    return data;
  });

  private readonly sortService = inject(SortService);
  private readonly configurationService = inject(ConfigurationService);

  ngOnInit(): void {
    this.configurationService.getBeans().subscribe(beans => {
      this.allBeans.set(beans);
    });

    this.configurationService.getPropertySources().subscribe(propertySources => this.propertySources.set(propertySources));
  }
}
