import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';
import { ProfileInfo } from './profile-info.model';

@Injectable()
export class ProfileService {
  private profileInfoUrl = SERVER_API_URL + 'api/profile-info';
  private profileInfo: Promise<ProfileInfo>;

  constructor(private http: HttpClient) {}

  getProfileInfo(): Promise<ProfileInfo> {
    if (!this.profileInfo) {
      this.profileInfo = this.http
        .get<ProfileInfo>(this.profileInfoUrl, { observe: 'response' })
        .map((res: HttpResponse<ProfileInfo>) => {
          const data = res.body;
          const pi = new ProfileInfo();
          pi.activeProfiles = data.activeProfiles;
          pi.ribbonEnv = data.ribbonEnv;
          pi.inProduction = data.activeProfiles.includes('prod');
          pi.swaggerEnabled = data.activeProfiles.includes('swagger');
          return pi;
        })
        .toPromise();
    }
    return this.profileInfo;
  }
}
