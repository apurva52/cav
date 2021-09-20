import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CavTopPanelNavigationService } from '../services/cav-top-panel-navigation.service';
import { CavConfigService } from '../services/cav-config.service';
// import { CavCommonUtils } from "../../../main/services/cav-common-utils.service";

import './config-rxjs-import';

import { ConfigUtilityService } from './config-utility.service';

import * as URL from '../constants/config-url-constant';
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class ConfigRestApiService {

  constructor(private _navService: CavTopPanelNavigationService, private _productConfig: CavConfigService, private http: HttpClient, private configUtilityService: ConfigUtilityService) { }

  className: string = "ConfigRestApiService";
  // Fetch data
  
  getDataByGetReq(url: string): Observable<any> {
    // url =   this.getURLRegardingMultiDC(url);

    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .pipe(map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      }),
      //...errors if any
      catchError((error: any) => {this.clearAllSessionAndLoginGui(error);
         this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' }); return throwError(error.error || 'Server Error') }))
  }

  getDataByGetReqForRunningTestStatus(url: string): Observable<any> {
    // url =   this.getURLRegardingMultiDC(url);
    // ...using get request
    return this.http.get(url).pipe(map((res: Response) => {
      return res;
    }),
      //...errors if any
      catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
         return throwError(error.error || 'Server Error') }))
  }

  // Fetch data
  getDataByGetReqWithNoJson(url: string): Observable<any> {
    // url =   this.getURLRegardingMultiDC(url);

    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    // ...using get request
    return this.http.get(url, {responseType : 'text'})
      .pipe(map((res: any) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      }),
      //...errors if any
      catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' }); return throwError(error.error || 'Server Error') }))
  }

  getDataByPostReq(url: string, body?: any): Observable<any> {
    // url =  this.getURLRegardingMultiDC(url);

    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    if (body == undefined)
      body = {};
      let headers = new HttpHeaders().set('Content-Type', 'application/json');// ... Set content type to JSON
      let options = { headers: headers };// Create a request option

    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .pipe(map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      }),
      //...errors if any
      catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' }); return throwError(error.error || 'Server Error') }));
  }

  getDataByPutReq(url: string, body?: Object): Observable<any> {
    // url =  this.getURLRegardingMultiDC(url);

    let headers = new HttpHeaders().set('Content-Type', 'application/json');// ... Set content type to JSON
    let options = { headers: headers };// Create a request option

    console.info(this.className, "getDataByPutReq", "URL", url, "Body", body);

    return this.http.put(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .pipe(map(res =><any> res),
      //...errors if any
      catchError((error: any) =>{this.clearAllSessionAndLoginGui(error);
        return throwError(error.error || 'Server Error')}));
  }
  /*  Get Agent Info according selected DC */
  getAgentDataByGetReq(url: string): Observable<any> {
    // url =  this.getURLRegardingMultiDC(url);

    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .pipe(map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      }),
      //...errors if any
      catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' }); return throwError(error.error || 'Server Error') }))
  }

  /* This method is used for get value in xml format */
  getXMLDataByPostReq(url: string, body?: any): Observable<any> {
    // url = this.getURLRegardingMultiDC(url);

    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    if (body == undefined)
      body = {};
      let headers = new HttpHeaders().set('Content-Type', 'application/xml');// ... Set content type to JSON
  //    let options = ;// Create a request option

    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, { headers: headers, 'responseType': 'text' }) // ...using post request
      .pipe(map((res: any) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      }),
      //...errors if any
      catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' }); return throwError(error.error || 'Server Error') }));
  }

  getDataByPostReqWithNoJSON(url: string, body?: any): Observable<any> {
  //  url = this.getURLRegardingMultiDC(url);

    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    if (body == undefined)
      body = {};
      let headers = new HttpHeaders().set('Content-Type', 'application/json');// ... Set content type to JSON
      
    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, {headers: headers, 'responseType':'text'}) // ...using post request
      // ...and calling .json() on the response to return data
      .pipe(map((res: any) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      }),
      //...errors if any
      catchError((error: any) => { this.clearAllSessionAndLoginGui(error);
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' }); return throwError(error.error || 'Server Error') }));
  }

  // This Method is used for get MultiDC data and Add Product key 
  // getURLRegardingMultiDC(url: string) {
  //   let productKey=sessionStorage.getItem('productKey');
  //   if (url.indexOf("?") > 0)
  //     url = this._productConfig.getINSPrefix() + this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + productKey;
  //   else
  //     url = this._productConfig.getINSPrefix() + this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + productKey;
   
  //     return url;
  //   }

   // This method is make url based on Env. whether singleDC or MultiDC in case of getting Permission from ACL
    // getURLRegardingMultiDCForPermission(url: string) {
    //   url = this._productConfig.getINSPrefix() ;
    //   let productKey=sessionStorage.getItem('productKey');
    //   if(this._navService.getDCNameForScreen('ndConfig')) 
    //      url = url + this._navService.getDCNameForScreen('ndConfig');
    //      else {
    //       if(sessionStorage.getItem('activeDC'))
    //         url = url + sessionStorage.getItem('activeDC');
    //     }
    //     return url;
    //   }

  // Clear ALL session and redirect on Login Gui
  clearAllSessionAndLoginGui(error) {
    // if (error._body == "117")
    //   this._utils.clearSessiononSessionClose();
  }

}
