import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import {CommonUtilityService} from './common-utility.service';
import { map, catchError } from "rxjs/operators";

import * as URL from '../constants/common-url-constant';
import { CavTopPanelNavigationService } from '../../../pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { CavConfigService } from '../../../pages/tools/configuration/nd-config/services/cav-config.service';
// import { CavCommonUtils } from "../../../pages/tools/";

@Injectable()
export class CommonRestApiService {
    productKey = this._productConfig.$productKey;
    constructor(private http: HttpClient, private _commonUtility: CommonUtilityService, private _productConfig: CavConfigService, private _navService: CavTopPanelNavigationService) { }

    getDataByGetReq(url: string): Observable<any> {
        //  url = this.getURLRegardingMultiDC(url);        
        this._commonUtility.progressBarEmit({flag: true, color: 'primary'});
        // ...using get request
        return this.http.get(url).pipe(map((res: Response) => {
            this._commonUtility.progressBarEmit({flag: false, color: 'primary'});
            return res;
          }),
          //...errors if any
          catchError((error: any) => {this.clearAllSessionAndLoginGui(error);
           this._commonUtility.progressBarEmit({flag: true, color: 'warn'}); 
          return throwError(error || 'Server Error')}))
      }


      getDataByPostReq(url: string, body? :any): Observable<any> {
        //  url = this.getURLRegardingMultiDC(url);
        this._commonUtility.progressBarEmit({flag: true, color: 'primary'});
        // ...using get request
        return this.http.post(url, body).pipe(map((res: Response) => {
            this._commonUtility.progressBarEmit({flag: false, color: 'primary'});
            return res;
          }),
          //...errors if any
          catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
           this._commonUtility.progressBarEmit({flag: true, color: 'warn'}); 
          return throwError(error || 'Server Error')}))
      }

   getDataByWithoutJsonPostReq(url: string, body? :any): Observable<any> {
        //  url = this.getURLRegardingMultiDC(url);
        this._commonUtility.progressBarEmit({flag: true, color: 'primary'});
        // ...using get request
        return this.http.post(url, body, { responseType: 'text', observe: 'response' }).pipe(map((res) => {
            this._commonUtility.progressBarEmit({flag: false, color: 'primary'});
            return res;
          }),
          //...errors if any
          catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
            this._commonUtility.progressBarEmit({flag: true, color: 'warn'}); 
          return throwError(error || 'Server Error')}))
      }
     
  // getURLRegardingMultiDC(url: string) {
  //  let productKey = this._productConfig.$productKey;
  //  if (url.indexOf("?") > 0)
  //     url = this._productConfig.getINSPrefix() + this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + productKey;
  //   else
  //     url = this._productConfig.getINSPrefix() + this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + productKey;
    
  //     return url;
  //   }

  clearAllSessionAndLoginGui(error) {
  //  if (error._body == "117")
  //    this._utils.clearSessiononSessionClose();
  }

}
