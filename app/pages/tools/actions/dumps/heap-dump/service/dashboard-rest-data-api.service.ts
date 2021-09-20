import {Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
// import {Logger} from '../../../../vendors/angular2-logger/core';
// import { CavConfigService } from '../../../main/services/cav-config.service';
// import { AuthenticationService } from '../../../main/services/authentication.service';
// import { CavCommonUtils } from "../../../main/services/cav-common-utils.service";
// import { MatDialog } from '@angular/material';
import { catchError, map, tap } from "rxjs/operators";
@Injectable()
export class DashboardRESTDataAPIService {

  constructor(private http: HttpClient,) {}
  // private log: Logger ,
  //  private router: Router,private _config : CavConfigService,private _auth :AuthenticationService,
  //   private _utils :CavCommonUtils ,
  //   private _dialog :MatDialog ) { }

  /*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPI( url: string, param: string) :Observable<any> {
    try {
      
      // this.log.info('Getting data from url = ' + url + ', param = ' + param);
    
      return this.http.get(url + param ).pipe(
        map((response) => response)
        , catchError((e) => {
           if(e.status == 400){
            // this._dialog.closeAll();
            // this._utils.clearSessiononSessionClose();
          }
          return throwError(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      // this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      // this.log.error(e);
    }
  }

  /*Getting Data Through REST API by using GET Method.*/
  getDataFromRESTUsingPOSTReq( url: string, param: string, data: any): Observable<any> {
    try {
      let productKeyperms;
    
      // this.log.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.post(url + param ,data).pipe(
        map((response) => response)
        , catchError((e) => {
            if(e.status == 400  ){
            //    this._dialog.closeAll();
            // this._utils.clearSessiononSessionClose();
          }
          /**this is done so in case of when user is uploading any content which is not supported than in that case this status 
           * code will come.
           */
          if (e.status == 415) {
           let result = '9';
            return result;
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      // this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      // this.log.error(e);
    }
  }

/*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPIForDerived( url: string, param: string) : Observable<any>{
    try {

      // this.log.info('Getting data from url = ' + url + ', param = ' + param);
     
      return this.http.get(url +param ).pipe(
        map(response => response)
         , catchError((e) => {

             if(e.status == 400 ){
            //     this._dialog.closeAll();
            // this._utils.clearSessiononSessionClose();
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      // this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      // this.log.error(e);
    }
  }

 /*Getting Data Through REST API by using GET Method in String format*/
  getDataByRESTAPIInString( url: string, param: string) : Observable<any> {
    try {

      // this.log.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.get(url + param, {responseType: 'text'}).pipe(
      tap( // Log the result or error
        data => data
              )
        
       );
    } catch (e) {
      // this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      // this.log.error(e);
    }
  }

  getDataByRESTAPIInStringUsingPost(url : string  ,data: any) :Observable<any>{
    //this.log.info('Getting data from url = ' + url + ', param = ' + param);
    try{
      return this.http.post(url , data,{responseType: 'text'} ,).pipe(
      tap( // Log the result or error
        data => data
              )
        
       );
    } catch (e) {
      // this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' );
      // this.log.error(e);
    }
  }

}
