import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, map, shareReplay } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { InfoResponse, ProfileInfo } from './profile-info.model';

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly infoUrl = `${serverApiUrl}management/info`;
  private profileInfo$?: Observable<ProfileInfo>;

  getProfileInfo(): Observable<ProfileInfo> {
    if (this.profileInfo$) {
      return this.profileInfo$;
    }

    this.profileInfo$ = this.http.get<InfoResponse>(this.infoUrl).pipe(
      map((response: InfoResponse) => {
        const { activeProfiles } = response;
        const profileInfo: ProfileInfo = {
          activeProfiles,
          inProduction: activeProfiles?.includes('prod'),
          openAPIEnabled: activeProfiles?.includes('api-docs'),
        };
        if (activeProfiles && response['display-ribbon-on-profiles']) {
          const displayRibbonOnProfiles = response['display-ribbon-on-profiles'].split(',');
          const ribbonProfiles = displayRibbonOnProfiles.filter(profile => activeProfiles.includes(profile));
          if (ribbonProfiles.length > 0) {
            profileInfo.ribbonEnv = ribbonProfiles[0];
          }
        }
        return profileInfo;
      }),
      shareReplay(),
    );
    return this.profileInfo$;
  }
}
