import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  constructor(private $sessionStorage: SessionStorageService) {}

  storeUrl(url: string) {
    this.$sessionStorage.store('previousUrl', url);
  }

  getUrl() {
    return this.$sessionStorage.retrieve('previousUrl');
  }
}
