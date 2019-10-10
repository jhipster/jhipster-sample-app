import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { ProfileInfo } from './profile-info.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private infoUrl = SERVER_API_URL + 'management/info';
  private profileInfo$: Observable<ProfileInfo>;

  constructor(private http: HttpClient) {}

  getProfileInfo(): Observable<ProfileInfo> {
    if (this.profileInfo$) {
      return this.profileInfo$;
    }

    this.profileInfo$ = this.http.get<ProfileInfo>(this.infoUrl).pipe(
      map((profileInfo: ProfileInfo) => {
        const pi = new ProfileInfo();
        pi.activeProfiles = profileInfo.activeProfiles;
        const displayRibbonOnProfiles = profileInfo['display-ribbon-on-profiles'].split(',');
        if (pi.activeProfiles) {
          const ribbonProfiles = displayRibbonOnProfiles.filter(profile => pi.activeProfiles.includes(profile));
          if (ribbonProfiles.length !== 0) {
            pi.ribbonEnv = ribbonProfiles[0];
          }
          pi.inProduction = pi.activeProfiles.includes('prod');
          pi.swaggerEnabled = pi.activeProfiles.includes('swagger');
        }
        return pi;
      }),
      shareReplay()
    );
    return this.profileInfo$;
  }
}
