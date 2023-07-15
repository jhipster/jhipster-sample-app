import { Component, OnInit } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { ConfigurationService } from './configuration.service';
import { Bean, PropertySource } from './configuration.model';

@Component({
  standalone: true,
  selector: 'jhi-configuration',
  templateUrl: './configuration.component.html',
  imports: [SharedModule, FormsModule, SortDirective, SortByDirective],
})
export default class ConfigurationComponent implements OnInit {
  allBeans!: Bean[];
  beans: Bean[] = [];
  beansFilter = '';
  beansAscending = true;
  propertySources: PropertySource[] = [];

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.configurationService.getBeans().subscribe(beans => {
      this.allBeans = beans;
      this.filterAndSortBeans();
    });

    this.configurationService.getPropertySources().subscribe(propertySources => (this.propertySources = propertySources));
  }

  filterAndSortBeans(): void {
    const beansAscendingValue = this.beansAscending ? -1 : 1;
    const beansAscendingValueReverse = this.beansAscending ? 1 : -1;
    this.beans = this.allBeans
      .filter(bean => !this.beansFilter || bean.prefix.toLowerCase().includes(this.beansFilter.toLowerCase()))
      .sort((a, b) => (a.prefix < b.prefix ? beansAscendingValue : beansAscendingValueReverse));
  }
}
