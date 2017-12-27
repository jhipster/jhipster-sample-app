import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class JhiConfigurationService {

    constructor(private http: Http) {
    }

    get(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/configprops').map((res: Response) => {
            const properties: any[] = [];

            const propertiesObject = res.json();

            for (const key in propertiesObject) {
                if (propertiesObject.hasOwnProperty(key)) {
                    properties.push(propertiesObject[key]);
                }
            }

            return properties.sort((propertyA, propertyB) => {
                return (propertyA.prefix === propertyB.prefix) ? 0 :
                       (propertyA.prefix < propertyB.prefix) ? -1 : 1;
            });
        });
    }

    getEnv(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/env').map((res: Response) => {
            const properties: any = {};

            const propertiesObject = res.json();

            for (const key in propertiesObject) {
                if (propertiesObject.hasOwnProperty(key)) {
                    const valsObject = propertiesObject[key];
                    const vals: any[] = [];

                    for (const valKey in valsObject) {
                        if (valsObject.hasOwnProperty(valKey)) {
                            vals.push({key: valKey, val: valsObject[valKey]});
                        }
                    }
                    properties[key] = vals;
                }
            }

            return properties;
        });
    }
}
